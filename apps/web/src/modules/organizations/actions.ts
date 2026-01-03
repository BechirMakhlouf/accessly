'use server';

import { OrgErrorCode } from '@accessly/core';
import { createOrgService } from './organization-factory';
import type { InviteStatus, OrgInput, OrgRole, OrgUpdate } from './types';

export async function getOrgBySlug(slug: string) {
  const orgService = await createOrgService();
  return await orgService.getBySlug(slug);
}

export async function getOrgById(orgId: string) {
  const orgService = await createOrgService();
  return await orgService.getById(orgId);
}

export async function createOrg(newOrg: OrgInput) {
  const orgService = await createOrgService();
  const result = await orgService.create(newOrg);

  console.debug('result: ', result);
  if (result.error || !result.data) {
    return result;
  }

  return await orgService.getBySlug(result.data.slug);
}

export async function isSlugUnique(slug: string) {
  const orgService = await createOrgService();
  const result = await orgService.isSlugUnique(slug);
  return result.data;
}

export async function genUniqueOrgSlug(name: string) {
  const orgService = await createOrgService();
  return await orgService.generateUniqueSlug(name);
}

export async function getUserOrgs() {
  const orgService = await createOrgService();
  const result = await orgService.getUserOrgs();

  if (result.error) {
    console.error('Failed to load organizations:', result.error);
    return null;
  }

  return result.data;
}

export async function updateOrganization(orgId: string, updates: OrgUpdate) {
  const orgService = await createOrgService();
  return await orgService.update(orgId, updates);
}

export async function getOrganizationMembers(orgId: string) {
  const orgService = await createOrgService();
  return await orgService.getMembers(orgId);
}

export async function updateMemberRole(
  orgId: string,
  memberId: string,
  newRole: OrgRole
) {
  const orgService = await createOrgService();
  return await orgService.updateMemberRole(orgId, memberId, newRole);
}

export async function removeMember(orgId: string, memberId: string) {
  const orgService = await createOrgService();
  return await orgService.removeMember(orgId, memberId);
}

export async function leaveOrganization(orgId: string) {
  const orgService = await createOrgService();
  return await orgService.leaveOrganization(orgId);
}

export async function inviteMember(
  orgId: string,
  email: string,
  role: OrgRole
) {
  const orgService = await createOrgService();
  return await orgService.inviteMember(orgId, role, email);
}

export async function deleteOrganization(orgId: string) {
  const orgService = await createOrgService();
  return await orgService.delete(orgId);
}

export async function getOrgInvites(orgId: string) {
  const orgService = await createOrgService();
  return await orgService.getOrgInvites(orgId);
}

export async function updateInviteStatus(
  inviteId: string,
  status: InviteStatus
) {
  const orgService = await createOrgService();
  return await orgService.updateInviteStatus(inviteId, status);
}

export async function getUserInvites() {
  const orgService = await createOrgService();
  return await orgService.getUserInvites();
}

export async function updateUserOwnInvite(
  inviteId: string,
  status: 'accepted' | 'rejected'
) {
  const orgService = await createOrgService();
  return await orgService.updateUserOwnInvite(inviteId, status);
}

export async function getInviteById(inviteId: string) {
  const orgService = await createOrgService();
  return await orgService.getInviteById(inviteId);
}

export async function getPublicInviteById(inviteId: string) {
  const { createAdminClient } = await import('@/lib/supabase/adminClient');
  const adminSupabase = await createAdminClient();

  const { data, error } = await adminSupabase
    .from('invites')
    .select(
      `
      *,
      organization:organizations!inner(
        *
      ),
      inviterProfile:user_profiles!invited_by(
        *
      )
    `
    )
    .eq('id', inviteId)
    .single();

  if (error) {
    console.error('Failed to load invite:', error);
    if (error.code === 'PGRST116') {
      return { error: OrgErrorCode.INVITE_NOT_FOUND };
    }
    return { error: OrgErrorCode.INVITE_FAILED_TO_LOAD };
  }

  return { data };
}

export async function getUserInvitesWithOrganizations() {
  const orgService = await createOrgService();
  return await orgService.getUserInvitesWithOrganizations();
}
