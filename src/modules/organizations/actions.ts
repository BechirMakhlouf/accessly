// Server-only
// import { createSSRClient } from '@/lib/supabase/server';
// import { Organization, OrganizationMembership } from './types';

// export async function getOrgAndMembershipBySlug(slug: string, userId: string | null)
//   : Promise<{ org: Organization | null; membership: OrganizationMembership | null }> {
//   if (!slug) return { org: null, membership: null };
//
//   const supabase = await createSSRClient();
//
//   const { data, error } = await supabase
//     .from('organizations')
//     .select(`*, organization_members!inner(user_id, role)`)
//     .eq('slug', slug)
//     .eq("user_id", userId!)
//     .limit(1)
//     .single();
//
//   if (error || !data) {
//     return { org: null, membership: null };
//   }
//
//   const org: Organization = data;
//   // let membership: OrganizationMembership = data.organization_members;
//
//   // return { org, membership };
// }
