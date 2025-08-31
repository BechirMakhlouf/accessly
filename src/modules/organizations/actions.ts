"use server";

import { createSSRClient } from '@/lib/supabase/server';
import { OrganizationInsertWithOptionalSlug, OrganizationUpdate } from './types';
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
  const userId = await assertSignedInAndGetUserId();
  
  if (!userId) {
    return { error: "User not authenticated" };
  }

  const slug = await genUniqueOrgSlug(newOrg.name, supabase);

  if (isNullOrUndefined(slug)) {
    console.error("error while generating slug");
    return { error: "Failed to generate unique slug" };
  }

  // Start a transaction to create organization and add user as owner
  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .insert({ 
      ...newOrg, 
      slug,
      created_by: userId 
    })
    .select()
    .single();

  if (orgError) {
    console.error("error while creating organization: ", orgError);
    return { error: "Failed to create organization" };
  }

  // Add the creator as an owner member
  const { error: memberError } = await supabase
    .from("organization_members")
    .insert({
      user_id: userId,
      organization_id: orgData.id,
      role: "owner"
    });

  if (memberError) {
    console.error("error while adding user as member: ", memberError);
    // Try to clean up the created organization
    await supabase.from("organizations").delete().eq("id", orgData.id);
    return { error: "Failed to add user as member" };
  }

  return await getOrgBySlug(slug);
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

export async function updateOrganization(orgId: string, updates: OrganizationUpdate) {
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();

  // Check if user has permission to update this organization
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .single();

  if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
    return { error: 'Insufficient permissions' };
  }

  const { data, error } = await supabase
    .from('organizations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', orgId)
    .select()
    .single();

  if (error) {
    console.error('Failed to update organization:', error);
    return { error: 'Failed to update organization' };
  }

  return { data };
}

export async function getOrganizationMembers(orgId: string) {
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();

  // Check if user is a member of this organization
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .single();

  if (!membership) {
    return { error: 'Not a member of this organization' };
  }

  // First get organization members
  const { data: membersData, error: membersError } = await supabase
    .from('organization_members')
    .select(`
      user_id,
      role,
      joined_at,
      last_active_at
    `)
    .eq('organization_id', orgId);

  if (membersError) {
    console.error('Failed to load organization members:', membersError);
    return { error: 'Failed to load members' };
  }

  // Then get user profiles for each member
  const membersWithProfiles = await Promise.all(
    membersData.map(async (member) => {
      // Get user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id, full_name, avatar_url')
        .eq('id', member.user_id)
        .single();

      // Get user email from auth.users (this requires admin privileges)
      // For now, we'll use a placeholder since we can't directly access auth.users
      const email = profile?.full_name ? `${profile.full_name.toLowerCase().replace(/\s+/g, '.')}@example.com` : `user-${member.user_id.slice(0, 8)}@example.com`;

      return {
        ...member,
        profiles: profile || { id: member.user_id, full_name: null, avatar_url: null },
        email
      };
    })
  );

  return { data: membersWithProfiles };
}

export async function updateMemberRole(orgId: string, memberId: string, newRole: "admin" | "member" | "owner") {
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();

  // Check if user has admin permissions
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .single();

  if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
    return { error: 'Insufficient permissions' };
  }

  // Prevent changing owner role
  if (newRole === 'owner') {
    return { error: 'Cannot assign owner role' };
  }

  const { data, error } = await supabase
    .from('organization_members')
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq('organization_id', orgId)
    .eq('user_id', memberId)
    .select()
    .single();

  if (error) {
    console.error('Failed to update member role:', error);
    return { error: 'Failed to update member role' };
  }

  return { data };
}

export async function removeMember(orgId: string, memberId: string) {
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();

  // Check if user has admin permissions
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .single();

  if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
    return { error: 'Insufficient permissions' };
  }

  // Prevent removing owner
  const { data: targetMember } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', orgId)
    .eq('user_id', memberId)
    .single();

  if (targetMember?.role === 'owner') {
    return { error: 'Cannot remove organization owner' };
  }

  const { error } = await supabase
    .from('organization_members')
    .delete()
    .eq('organization_id', orgId)
    .eq('user_id', memberId);

  if (error) {
    console.error('Failed to remove member:', error);
    return { error: 'Failed to remove member' };
  }

  return { success: true };
}

export async function leaveOrganization(orgId: string) {
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();

  // Check if user is the owner
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .single();

  if (!membership) {
    return { error: 'Not a member of this organization' };
  }

  if (membership.role === 'owner') {
    return { error: 'Owner cannot leave organization. Transfer ownership first.' };
  }

  const { error } = await supabase
    .from('organization_members')
    .delete()
    .eq('organization_id', orgId)
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to leave organization:', error);
    return { error: 'Failed to leave organization' };
  }

  return { success: true };
}

export async function inviteMember(orgId: string, email: string, role: "admin" | "member" | "owner") {
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();

  // Check if user has admin permissions
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .single();

  if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
    return { error: 'Insufficient permissions' };
  }

  // Generate invite token
  const inviteToken = crypto.randomUUID();

  const { data, error } = await supabase
    .from('invites')
    .insert({
      organization_id: orgId,
      invited_by: userId,
      invite_token: inviteToken,
      email,
      role,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create invite:', error);
    return { error: 'Failed to create invite' };
  }

  // TODO: Send email invitation
  console.log('Invite created:', data);

  return { data };
}