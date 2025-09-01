"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useActiveOrganization } from "@/modules/organizations";
import {
  useOrganizationMembers,
  useUpdateMemberRole,
  useRemoveMember,
  useInviteMember,
  useCurrentUserRole,
  OrgRole,
  canManageMembers,
  Organization,
  OrgMember
} from "@/modules/organizations";

const ITEMS_PER_PAGE = 10;

export interface UseMembersPageReturn {
  // State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isInviteModalOpen: boolean;
  setIsInviteModalOpen: (open: boolean) => void;
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  inviteRole: OrgRole;
  setInviteRole: (role: OrgRole) => void;

  // Data
  org: Organization | null;
  members: OrgMember[];
  filteredMembers: OrgMember[];
  paginatedMembers: OrgMember[];
  currentUserRole: { role: OrgRole } | null;
  canManageMembersRole: boolean;
  isLoading: boolean;
  error: Error | null;

  // Computed values
  totalPages: number;
  startIndex: number;
  isAllSelected: boolean;
  totalFilteredMembers: number;

  // Actions
  handleRoleChange: (memberId: string, newRole: OrgRole) => Promise<void>;
  handleDeleteMember: (memberId: string) => Promise<void>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectMember: (memberId: string, checked: boolean) => void;
  handleInviteMember: () => Promise<void>;
  handleBulkDelete: () => Promise<void>;

  // Mutations
  updateRoleMutation: ReturnType<typeof useUpdateMemberRole>;
  removeMemberMutation: ReturnType<typeof useRemoveMember>;
  inviteMemberMutation: ReturnType<typeof useInviteMember>;
}

export const useMembersPage = (): UseMembersPageReturn => {
  const { activeOrganization: org } = useActiveOrganization();
  const t = useTranslations("org.members");
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OrgRole>("member");

  // Data fetching
  const { 
    data: membersData, 
    isLoading, 
    error 
  } = useOrganizationMembers(org?.id || "");

  const members = useMemo(() => membersData || [], [membersData]);
  const currentUserRole = useCurrentUserRole(org?.id || "");

  // Mutations
  const updateRoleMutation = useUpdateMemberRole();
  const removeMemberMutation = useRemoveMember();
  const inviteMemberMutation = useInviteMember();

  // Computed values
  const canManageMembersRole = currentUserRole ? canManageMembers(currentUserRole.role) : false;

  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      member.user_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const isAllSelected = paginatedMembers.length > 0 && selectedMembers.length === paginatedMembers.length;
  const totalFilteredMembers = filteredMembers.length;

  // Actions
  const handleRoleChange = async (memberId: string, newRole: OrgRole) => {
    if (!org) return;
    
    try {
      const result = await updateRoleMutation.mutateAsync({ orgId: org.id, memberId, newRole });
      
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(t('actions.roleUpdated'));
      }
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error(t('actions.roleUpdateError'));
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!org) return;
    
    try {
      const result = await removeMemberMutation.mutateAsync({ orgId: org.id, memberId });
      
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(t('actions.memberRemoved'));
      }
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error(t('actions.memberRemoveError'));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(paginatedMembers.map((member) => member.user_id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers((prev) => [...prev, memberId]);
    } else {
      setSelectedMembers((prev) => prev.filter((id) => id !== memberId));
    }
  };

  const handleInviteMember = async () => {
    if (!org || !inviteEmail.trim()) return;
    
    try {
      const result = await inviteMemberMutation.mutateAsync({ 
        orgId: org.id, 
        email: inviteEmail.trim(), 
        role: inviteRole 
      });
      
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(t('actions.invitationSent'));
        // Reset form
        setIsInviteModalOpen(false);
        setInviteEmail("");
        setInviteRole("member");
      }
    } catch (error) {
      console.error("Failed to invite member:", error);
      toast.error(t('actions.invitationError'));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMembers.length === 0 || !org) return;
    
    try {
      // Process all deletions sequentially
      for (const memberId of selectedMembers) {
        const result = await removeMemberMutation.mutateAsync({ orgId: org.id, memberId });
        if (result?.error) {
          toast.error(`Failed to remove member ${memberId}: ${result.error}`);
        }
      }
      
      toast.success(t('actions.memberRemoved'));
      setSelectedMembers([]);
    } catch (error) {
      console.error("Failed to bulk delete members:", error);
      toast.error(t('actions.memberRemoveError'));
    }
  };

  return {
    // State
    searchQuery,
    setSearchQuery,
    selectedMembers,
    setSelectedMembers,
    currentPage,
    setCurrentPage,
    isInviteModalOpen,
    setIsInviteModalOpen,
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,

    // Data
    org,
    members,
    filteredMembers,
    paginatedMembers,
    currentUserRole,
    canManageMembersRole,
    isLoading,
    error,

    // Computed values
    totalPages,
    startIndex,
    isAllSelected,
    totalFilteredMembers,

    // Actions
    handleRoleChange,
    handleDeleteMember,
    handleSelectAll,
    handleSelectMember,
    handleInviteMember,
    handleBulkDelete,

    // Mutations
    updateRoleMutation,
    removeMemberMutation,
    inviteMemberMutation,
  };
};
