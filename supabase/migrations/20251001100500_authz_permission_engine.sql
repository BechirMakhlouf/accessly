-- authz permission engine
-- Schema, tables, constraints, triggers, indexes, and decision functions

-- Optional: ensure extension for gen_random_uuid()
create extension if not exists pgcrypto;

-- Schema
create schema if not exists authz;

-- Types
create type authz.edge_traverse as enum ('in', 'out');

-- Registry tables
create table authz.object_type (
	id uuid primary key default gen_random_uuid(),
	key text not null unique
);

create table authz.object (
	id uuid primary key default gen_random_uuid(),
	type_id uuid not null references authz.object_type(id),
	unique (id, type_id)
);

create table authz.principal_type (
	id uuid primary key default gen_random_uuid(),
	key text not null unique
);

create table authz.principal (
	id uuid primary key default gen_random_uuid(),
	type_id uuid not null references authz.principal_type(id),
	unique (id, type_id)
);

create table authz.principal_membership (
	parent_id uuid not null references authz.principal(id) on delete cascade,
	child_id uuid not null references authz.principal(id) on delete cascade,
	primary key (parent_id, child_id),
	check (parent_id <> child_id)
);

-- Relations and actions
create table authz.relation_type (
	id uuid primary key default gen_random_uuid(),
	object_type_id uuid not null references authz.object_type(id),
	key text not null,
	unique (object_type_id, key)
);

create table authz.action (
	id uuid primary key default gen_random_uuid(),
	object_type_id uuid not null references authz.object_type(id),
	key text not null,
	unique (object_type_id, key)
);

create table authz.action_requires_relation (
	action_id uuid not null references authz.action(id) on delete cascade,
	relation_type_id uuid not null references authz.relation_type(id),
	primary key (action_id, relation_type_id)
);

-- Object graph
create table authz.edge_type (
	id uuid primary key default gen_random_uuid(),
	key text not null unique,
	src_object_type_id uuid not null references authz.object_type(id),
	dst_object_type_id uuid not null references authz.object_type(id)
);

create table authz.edge (
	edge_type_id uuid not null references authz.edge_type(id) on delete cascade,
	src_object_id uuid not null references authz.object(id) on delete cascade,
	dst_object_id uuid not null references authz.object(id) on delete cascade,
	primary key (edge_type_id, src_object_id, dst_object_id)
);

-- Derivation rules
create table authz.relation_derivation (
	id uuid primary key default gen_random_uuid(),
	from_relation_type_id uuid not null references authz.relation_type(id),
	to_relation_type_id uuid not null references authz.relation_type(id),
	via_edge_type_id uuid references authz.edge_type(id),
	traverse authz.edge_traverse,
	check ((via_edge_type_id is null and traverse is null) or (via_edge_type_id is not null and traverse is not null)),
	unique (from_relation_type_id, to_relation_type_id, via_edge_type_id, traverse)
);

-- Grants (positive only). Avoid reserved word "grant" by naming relation_grant
create table authz.relation_grant (
	object_id uuid not null references authz.object(id) on delete cascade,
	relation_type_id uuid not null references authz.relation_type(id),
	principal_id uuid not null references authz.principal(id) on delete cascade,
	primary key (object_id, relation_type_id, principal_id)
);

-- Validation trigger functions
create or replace function authz.tg_assert_action_requires_relation_same_object_type()
returns trigger
language plpgsql
as $$
declare
	action_object_type uuid;
	relation_object_type uuid;
begin
	select object_type_id into action_object_type from authz.action where id = new.action_id;
	select object_type_id into relation_object_type from authz.relation_type where id = new.relation_type_id;
	if action_object_type is null or relation_object_type is null then
		raise exception 'authz: action or relation_type not found';
	end if;
	if action_object_type <> relation_object_type then
		raise exception 'authz: action %.object_type_id must match relation_type %.object_type_id', new.action_id, new.relation_type_id;
	end if;
	return new;
end;$$;

create or replace function authz.tg_assert_edge_types_align()
returns trigger
language plpgsql
as $$
declare
	src_type uuid;
	dst_type uuid;
	edge_src_type uuid;
	edge_dst_type uuid;
begin
	select type_id into src_type from authz.object where id = new.src_object_id;
	select type_id into dst_type from authz.object where id = new.dst_object_id;
	select src_object_type_id, dst_object_type_id into edge_src_type, edge_dst_type from authz.edge_type where id = new.edge_type_id;
	if src_type is null or dst_type is null or edge_src_type is null or edge_dst_type is null then
		raise exception 'authz: edge validation lookup failed';
	end if;
	if src_type <> edge_src_type or dst_type <> edge_dst_type then
		raise exception 'authz: edge object types must match edge_type definition';
	end if;
	return new;
end;$$;

create or replace function authz.tg_assert_relation_grant_type_alignment()
returns trigger
language plpgsql
as $$
declare
	obj_type uuid;
	rel_obj_type uuid;
begin
	select type_id into obj_type from authz.object where id = new.object_id;
	select object_type_id into rel_obj_type from authz.relation_type where id = new.relation_type_id;
	if obj_type is null or rel_obj_type is null then
		raise exception 'authz: grant validation lookup failed';
	end if;
	if obj_type <> rel_obj_type then
		raise exception 'authz: relation_type.object_type_id must equal object.type_id';
	end if;
	return new;
end;$$;

create or replace function authz.tg_assert_relation_derivation_alignment()
returns trigger
language plpgsql
as $$
declare
	from_obj_type uuid;
	to_obj_type uuid;
	edge_src_type uuid;
	edge_dst_type uuid;
begin
	select object_type_id into from_obj_type from authz.relation_type where id = new.from_relation_type_id;
	select object_type_id into to_obj_type from authz.relation_type where id = new.to_relation_type_id;
	if new.via_edge_type_id is null then
		if from_obj_type is null or to_obj_type is null then
			raise exception 'authz: derivation relation lookup failed';
		end if;
		if from_obj_type <> to_obj_type then
			raise exception 'authz: same-object derivation requires matching object types';
		end if;
		if new.traverse is not null then
			raise exception 'authz: same-object derivation must have traverse null';
		end if;
		return new;
	else
		if new.traverse is null then
			raise exception 'authz: cross-object derivation requires traverse direction';
		end if;
		select src_object_type_id, dst_object_type_id into edge_src_type, edge_dst_type from authz.edge_type where id = new.via_edge_type_id;
		if from_obj_type is null or to_obj_type is null or edge_src_type is null or edge_dst_type is null then
			raise exception 'authz: derivation edge/relations lookup failed';
		end if;
		if new.traverse = 'out' then
			-- current object is edge src; neighbor is edge dst
			if to_obj_type <> edge_src_type or from_obj_type <> edge_dst_type then
				raise exception 'authz: derivation OUT must map to_relation to edge.src and from_relation to edge.dst';
			end if;
		elsif new.traverse = 'in' then
			-- current object is edge dst; neighbor is edge src
			if to_obj_type <> edge_dst_type or from_obj_type <> edge_src_type then
				raise exception 'authz: derivation IN must map to_relation to edge.dst and from_relation to edge.src';
			end if;
		else
			raise exception 'authz: invalid traverse value';
		end if;
		return new;
	end if;
end;$$;

-- Triggers
create trigger trg_action_requires_relation_validate
	before insert or update on authz.action_requires_relation
	for each row execute function authz.tg_assert_action_requires_relation_same_object_type();

create trigger trg_edge_validate_types
	before insert or update on authz.edge
	for each row execute function authz.tg_assert_edge_types_align();

create trigger trg_relation_grant_validate_types
	before insert or update on authz.relation_grant
	for each row execute function authz.tg_assert_relation_grant_type_alignment();

create trigger trg_relation_derivation_validate
	before insert or update on authz.relation_derivation
	for each row execute function authz.tg_assert_relation_derivation_alignment();

-- Indexes
create index if not exists idx_relation_grant_principal_rel_obj on authz.relation_grant (principal_id, relation_type_id, object_id);
create index if not exists idx_relation_grant_obj_rel on authz.relation_grant (object_id, relation_type_id);
create index if not exists idx_principal_membership_child_parent on authz.principal_membership (child_id, parent_id);
create index if not exists idx_edge_src on authz.edge (src_object_id);
create index if not exists idx_edge_dst on authz.edge (dst_object_id);
create index if not exists idx_relation_derivation_to_rel on authz.relation_derivation (to_relation_type_id);
create index if not exists idx_action_requires_relation_action on authz.action_requires_relation (action_id);

-- Decision function: can(principal, action_key, object_id)
create or replace function authz.can(
	p_principal uuid,
	p_action_key text,
	p_object_id uuid
) returns boolean
language sql
stable
as $$
with
target_object as (
	select o.id as object_id, o.type_id as object_type_id
	from authz.object o
	where o.id = p_object_id
),
target_action as (
	select a.id as action_id, a.object_type_id
	from authz.action a
	join target_object t on t.object_type_id = a.object_type_id
	where a.key = p_action_key
),
required_relations as (
	select arr.relation_type_id
	from authz.action_requires_relation arr
	join target_action ta on ta.action_id = arr.action_id
),
principal_closure as (
	with recursive pc(principal_id) as (
		select p_principal
		union
		select pm.parent_id
		from authz.principal_membership pm
		join pc on pc.principal_id = pm.child_id
	)
	select principal_id from pc
),
pairs(object_id, relation_type_id) as (
	select t.object_id, rr.relation_type_id
	from target_object t
	join required_relations rr on true

	union

	select p.object_id, rd.from_relation_type_id
	from pairs p
	join authz.relation_derivation rd
		on rd.to_relation_type_id = p.relation_type_id
		and rd.via_edge_type_id is null

	union

	select case rd.traverse
			when 'out' then e.dst_object_id
			when 'in'  then e.src_object_id
		end as neighbor_object_id,
		rd.from_relation_type_id
	from pairs p
	join authz.relation_derivation rd
		on rd.to_relation_type_id = p.relation_type_id
		and rd.via_edge_type_id is not null
	join authz.edge e
		on e.edge_type_id = rd.via_edge_type_id
		and ((rd.traverse = 'out' and e.src_object_id = p.object_id) or (rd.traverse = 'in' and e.dst_object_id = p.object_id))
),
hits as (
	select 1
	from authz.relation_grant g
	join pairs p
		on p.object_id = g.object_id and p.relation_type_id = g.relation_type_id
	join principal_closure pc
		on pc.principal_id = g.principal_id
	limit 1
)
select exists(select 1 from hits);
$$;

-- Batch function: can_many(principal, items[{action, object_id}])
create or replace function authz.can_many(
	p_principal uuid,
	p_items jsonb
) returns table (
	action_key text,
	object_id uuid,
	allowed boolean
)
language plpgsql
stable
as $$
declare
	item jsonb;
begin
	for item in select * from jsonb_array_elements(p_items) loop
		return query
		select
			item->>'action' as action_key,
			(item->>'object_id')::uuid as object_id,
			authz.can(p_principal, item->>'action', (item->>'object_id')::uuid) as allowed;
	end loop;
end;
$$;

