"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/hooks/useAuth";
import { useOrganizationsStore } from "./store";
import {
  getUserOrganizationsQueryOptions,
  getOrganizationQueryOptions,
  getOrganizationBySlugQueryOptions,
  getOrganizationMembersQueryOptions,
  createOrganizationMutationOptions,
  updateOrganizationMutationOptions,
  updateMemberRoleMutationOptions,
  removeMemberMutationOptions,
  leaveOrganizationMutationOptions,
  inviteMemberMutationOptions,
  checkSlugUniquenessMutationOptions,
} from "./queries";
import type { OrgMember } from "./types";

export function useActiveOrganization() {
  const { activeOrganization, setActiveOrganization } = useOrganizationsStore();
  return { activeOrganization, setActiveOrganization };
}

export function useUserOrganizations() {
  return useQuery(getUserOrganizationsQueryOptions());
}

export function useOrganization(orgId: string) {
  return useQuery(getOrganizationQueryOptions(orgId));
}

export function useOrganizationBySlug(slug: string) {
  return useQuery(getOrganizationBySlugQueryOptions(slug));
}

export function useOrganizationMembers(orgId: string) {
  return useQuery(getOrganizationMembersQueryOptions(orgId));
}

export function useCurrentUserRole(orgId: string): OrgMember | null {
  const { user } = useAuth();
  const { data: membersData } = useOrganizationMembers(orgId);
  
  if (!user || !membersData) return null;
  
  //TODO: maybe improve this by making a map or object (or any key/value store)
  return membersData.find(m => m.user_id === user.id) || null;
}

export function useCurrentUserMembership(orgId: string) {
  const { user } = useAuth();
  const { data: membersData } = useOrganizationMembers(orgId);
  
  if (!user || !membersData) return null;
  
  return membersData.find(m => m.user_id === user.id)?.role || null;
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation(createOrganizationMutationOptions(queryClient));
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation(updateOrganizationMutationOptions(queryClient));
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  return useMutation(updateMemberRoleMutationOptions(queryClient));
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation(removeMemberMutationOptions(queryClient));
}

export function useLeaveOrganization() {
  const queryClient = useQueryClient();
  return useMutation(leaveOrganizationMutationOptions(queryClient));
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation(inviteMemberMutationOptions(queryClient));
}

export function useCheckSlugUniqueness() {
  return useMutation(checkSlugUniquenessMutationOptions());
}
