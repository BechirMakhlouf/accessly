"use server";

import { createSSRClient } from '@/lib/supabase/server';
import { OrganizationInsertWithOptionalSlug } from './types';
import { TypedSupabaseClient } from '@/lib/supabase/type';
import { isNullOrUndefined } from '@/lib/utils';
import { assertSignedInAndGetUserId } from '@/lib/auth/server-utils';

export async function getOrgBySlug(slug: string) {

  if (!slug) return { data: null, error: "org.notfound" };

  const supabase = await createSSRClient();

  return await supabase
    .from('organizations')
    .select(`*`)
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();
}

export async function createOrgWithoutSlug(newOrg: OrganizationInsertWithOptionalSlug) {
  const supabase = await createSSRClient();
  const slug = await genUniqueOrgSlug(newOrg.name, supabase);

  if (isNullOrUndefined(slug)) {
    console.error("error while generating slug");
    return
  }

  const insertResult = await supabase.from("organizations").insert({ ...newOrg, slug });
  if (insertResult.error) {
    console.error("error while creating errors: ", insertResult.error);
    return;
  }

  return await getOrgBySlug(slug)
}

export async function isSlugUnique(slug: string) {
  const supabase = await createSSRClient();
  const { data, error } = await supabase.rpc("is_organization_slugunique", { p_slug: slug });

  if (error)
    console.error("error while calling is_organization_slugunique: ", error);

  return data;
}

export async function genUniqueOrgSlug(name: string, supabase?: TypedSupabaseClient) {
  supabase = supabase ?? await createSSRClient();
  const { data, error } = await supabase.rpc("generate_unique_organization_slug", { p_name: name });

  if (error)
    console.error("error while calling generate_unique_organization_slug: ", error);

  return data;
}

export async function getUserOrgs() {
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();

  const { data, error } = await supabase
    .from("organizations")
    .select(`
      *,
      organization_members!inner(
        user_id,
        role,
        joined_at,
        last_active_at
      )
    `)
    .eq("organization_members.user_id", userId);

  if (error) {
    console.error("Failed to load organizations:", error);
    return null;
  }

  return data;
}