"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  getOrganizationMembers, 
  updateMemberRole, 
  removeMember, 
  leaveOrganization,
  inviteMember,
  updateOrganization
} from "./actions";
import { OrganizationUpdate } from "./types";
import { useAuth } from "@/lib/auth/hooks/useAuth";
import { useOrganizationsStore } from "./store";
import { routes } from "@/lib/routes";
import { useTranslations } from "next-intl";

export function useActiveOrganization() {
  const { activeOrganization, setActiveOrganization } = useOrganizationsStore();
  return { activeOrganization, setActiveOrganization };
}

export function useOrganizationMembers(orgId: string) {
  return useQuery({
    queryKey: ["organization-members", orgId],
    queryFn: () => getOrganizationMembers(orgId),
    enabled: !!orgId,
  });
}

export function useCurrentUserRole(orgId: string) {
  const { user } = useAuth();
  const { data: membersData } = useOrganizationMembers(orgId);
  
  if (!user || !membersData?.data) return null;
  
  const membership = membersData.data.find(m => m.user_id === user.id);
  return membership?.role || null;
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  const t = useTranslations('org.members');
  
  return useMutation({
    mutationFn: ({ orgId, memberId, newRole }: { orgId: string; memberId: string; newRole: "admin" | "member" | "owner" }) =>
      updateMemberRole(orgId, memberId, newRole),
    onSuccess: (data, { orgId }) => {
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(t('actions.roleUpdated'));
        queryClient.invalidateQueries({ queryKey: ["organization-members", orgId] });
      }
    },
    onError: (error) => {
      toast.error(t('actions.roleUpdateError'));
      console.error("Update member role error:", error);
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  const t = useTranslations('org.members');
  
  return useMutation({
    mutationFn: ({ orgId, memberId }: { orgId: string; memberId: string }) =>
      removeMember(orgId, memberId),
    onSuccess: (data, { orgId }) => {
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(t('actions.memberRemoved'));
        queryClient.invalidateQueries({ queryKey: ["organization-members", orgId] });
      }
    },
    onError: (error) => {
      toast.error(t('actions.memberRemoveError'));
      console.error("Remove member error:", error);
    },
  });
}

export function useLeaveOrganization() {
  const queryClient = useQueryClient();
  const t = useTranslations('org.members');
  
  return useMutation({
    mutationFn: ({ orgId }: { orgId: string }) => leaveOrganization(orgId),
    onSuccess: (data, { orgId }) => {
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(t('actions.leftOrganization'));
        queryClient.invalidateQueries({ queryKey: ["user-organizations"] });
        // Redirect to organizations list
        window.location.href = routes.protected.dashboard.organizations.root;
      }
    },
    onError: (error) => {
      toast.error(t('actions.leaveOrganizationError'));
      console.error("Leave organization error:", error);
    },
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  const t = useTranslations('org.members');
  
  return useMutation({
    mutationFn: ({ orgId, email, role }: { orgId: string; email: string; role: "admin" | "member" | "owner" }) =>
      inviteMember(orgId, email, role),
    onSuccess: (data, { orgId }) => {
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(t('actions.invitationSent'));
        queryClient.invalidateQueries({ queryKey: ["organization-members", orgId] });
      }
    },
    onError: (error) => {
      toast.error(t('actions.invitationError'));
      console.error("Invite member error:", error);
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  const t = useTranslations('organizations');
  
  return useMutation({
    mutationFn: ({ orgId, updates }: { orgId: string; updates: OrganizationUpdate }) =>
      updateOrganization(orgId, updates),
    onSuccess: (data, { orgId }) => {
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(t('actions.updated'));
        queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
        queryClient.invalidateQueries({ queryKey: ["user-organizations"] });
      }
    },
    onError: (error) => {
      toast.error(t('actions.updateError'));
      console.error("Update organization error:", error);
    },
  });
}
