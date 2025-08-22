"use server";

import { createSSRClient } from '@/lib/supabase/server';
import { Organization, OrganizationInsert } from './types';
import { getFullRoute } from '@/lib/routes';

export async function getOrgBySlug(slug: string)
  : Promise<{ data: Organization | null, error: unknown }> {

  if (!slug) return { data: null, error: "org.notfound" };

  const supabase = await createSSRClient();

  return await supabase
    .from('organizations')
    .select(`*`)
    .eq('slug', slug)
    .limit(1)
    .single();
}

export async function createOrg(newOrg: OrganizationInsert) {
  const supabase = await createSSRClient();

  return await supabase.from("organizations").insert(newOrg);
}

export async function inviteMember(orgId: string, email: string) {
  const supabase = await createSSRClient();
  return await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: getFullRoute("/dashboard"),
    data: { org: "bayiii" }
  })
}

