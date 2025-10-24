create or replace function public.can_boards(
  p_user_id  uuid,
  p_action   text,
  p_board_id uuid
) returns boolean
language plpgsql
security definer
stable
    set search_path = public
as $$
/*
Purpose
Central permission check for board actions.

Actions
    create a board
    view a board without seeing its content
    update Edit board fields
    delete Delete a board
    manage_members Add/remove/update board members
    request_access Request access to a board

Visibility rules (read)
    public -> everyone (including anonymous)
    org -> org members, board members, or the author
    private -> board members or the author

Edit rules

    update: board editor+ (editor/admin/owner), or org admin, or author
    delete: board owner, org admin, or author
    manage_members: board admin+ (admin/owner), or org admin */ declare -- Board facts v_visibility text; v_created_by uuid; v_org_id uuid;

-- Roles (as text for simplicity)
v_board_role text;
v_org_role   text;
v_visibility text;
v_created_by text;
v_org_id     text;
-- Helper flags
is_anonymous    boolean;
is_author       boolean;

is_board_member boolean;
is_board_owner  boolean;
is_board_admin  boolean;
is_board_editor boolean;

is_org_member   boolean;
is_org_admin    boolean;
begin
    -- 1. an see the board outer information (read)
    
    -- Load the board
    select b.visibility::text, b.created_by, b.organization_id
    into v_visibility, v_created_by, v_org_id
    from public.boards b
    where b.id = p_board_id;

    if not found then
    return false;
    end if;

    -- Identity flags
    is_anonymous := p_user_id is null;
    is_author    := p_user_id = v_created_by;

    -- Board role (if any)
    select bm.role::text
    into v_board_role
    from public.board_members bm
    where bm.board_id = p_board_id
    and bm.user_id  = p_user_id;

    is_board_member := v_board_role is not null;
    is_board_owner  := v_board_role = 'owner';
    is_board_admin  := v_board_role in ('owner','admin');
    is_board_editor := v_board_role in ('owner','admin','editor');

    -- Org role (if any) — order matches PK (user_id, organization_id)
    select om.role::text
    into v_org_role
    from public.organization_members om
    where om.user_id = p_user_id
    and om.organization_id = v_org_id;

    is_org_member := v_org_role is not null;
    is_org_admin  := v_org_role in ('owner','admin');

    -- Normalize action
    p_action := lower(p_action);

    -- Anonymous users: only read public boards
    if is_anonymous then
    return p_action = 'read' and v_visibility = 'public';
    end if;

    -- Authenticated users
    case p_action
    when 'read' then
    return
    v_visibility = 'public'
    or (v_visibility = 'org'     and (is_org_member or is_board_member or is_author))
    or (v_visibility = 'private' and (is_board_member or is_author));

    when 'update' then
    return is_board_editor or is_org_admin or is_author;

    when 'delete' then
    return is_board_owner or is_org_admin or is_author;

    when 'manage_members' then
    return is_board_admin or is_org_admin;

    else
    return false; -- unknown action

    end case;
end;
$$;
