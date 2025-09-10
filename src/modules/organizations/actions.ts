"use server";

import { createOrgService } from './organization-factory';
import { OrgUpdate, OrgRole, OrgInput } from './types';

export async function getOrgBySlug(slug: string) {
  const orgService = await createOrgService();
  return await orgService.getBySlug(slug);
}

export async function createOrg(newOrg: OrgInput) {
  const orgService = await createOrgService();
  const result = await orgService.create(newOrg);
  
  console.debug("result: ", result);
  if (result.error || !result.data) {
    return result;
  }
  
  // Return the created organization
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
  const result = await orgService.getUserOrganizations();
  
  if (result.error) {
    console.error("Failed to load organizations:", result.error);
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

export async function updateMemberRole(orgId: string, memberId: string, newRole: OrgRole) {
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

export async function inviteMember(orgId: string, orgName: string, email: string, role: OrgRole,) {
  const orgService = await createOrgService();
  return await orgService.inviteMember(orgId, orgName, role, email);
}

export async function deleteOrganization(orgId: string) {
  const orgService = await createOrgService();
  return await orgService.delete(orgId);
}