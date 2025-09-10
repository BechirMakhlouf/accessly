"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useActiveOrg, OrgRole, canManageMembers, Organization, OrgMember } from "@/modules/organizations";
import { routes } from "@/lib/routes";

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
  updateRoleMutation: {
    isPending: boolean;
    error: Error | null;
  };
  removeMemberMutation: {
    isPending: boolean;
    error: Error | null;
  };
  inviteMemberMutation: {
    isPending: boolean;
    error: Error | null;
  };
}

export const useMembersPage = (): UseMembersPageReturn => {
  const { 
    organization: org, 
    members, 
    isLoading, 
    error, 
    updateMemberRole, 
    removeMember, 
    inviteMember, 
    isUpdatingRole, 
    isRemovingMember, 
    isInvitingMember, 
    currentUserRole: userRole 
  } = useActiveOrg();
  
  const t = useTranslations("org.members");
  const router = useRouter();
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OrgRole>("member");

  const currentUserRole = useMemo(() => {
    return userRole ? { role: userRole } : null;
  }, [userRole]);

  // Handle redirect if no organization and not loading
  useEffect(() => {
    if (!org && !isLoading) {
      router.push(routes.protected.dashboard.organizations.root);
    }
  }, [org, isLoading, router]);

  // Computed values
  const canManageMembersRole = currentUserRole ? canManageMembers(currentUserRole.role) : false;

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    return members.filter((member: OrgMember) =>
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
    if (!org?.id) return;
    const memberList = members || [];

    if (newRole === 'member') {
      const target = memberList.find(m => m.user_id === memberId);
      if (target?.role === 'admin') {
        const otherAdmins = memberList.filter(m => m.role === 'admin' && m.user_id !== memberId);
        if (otherAdmins.length === 0) {
          toast.error(t('actions.cannotDemoteLastAdmin'));
          return;
        }
      }
    }

    try {
      await updateMemberRole(memberId, newRole);
      toast.success(t('actions.roleUpdated'));
    } catch (error) {
      console.error('Failed to update role:', error);
      toast.error(t('actions.roleUpdateError'));
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!org?.id) return;
    
    try {
      await removeMember(memberId);
      toast.success(t('actions.memberRemoved'));
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error(t('actions.memberRemoveError'));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(paginatedMembers.map((member: OrgMember) => member.user_id));
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
    if (!org?.id || !org || !inviteEmail.trim()) return;
    
    try {
      await inviteMember(inviteEmail.trim(), inviteRole, org.name);
      toast.success(t('actions.invitationSent'));
      // Reset form
      setIsInviteModalOpen(false);
      setInviteEmail("");
      setInviteRole("member");
    } catch (error) {
      console.error("Failed to invite member:", error);
      toast.error(t('actions.invitationError'));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMembers.length === 0 || !org?.id) return;
    
    try {
      // Process all deletions sequentially
      for (const memberId of selectedMembers) {
        await removeMember(memberId);
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
    org: org as Organization | null,
    members: members || [],
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
    updateRoleMutation: {
      isPending: isUpdatingRole,
      error: null, // Error handling is done in the action functions
    },
    removeMemberMutation: {
      isPending: isRemovingMember,
      error: null, // Error handling is done in the action functions
    },
    inviteMemberMutation: {
      isPending: isInvitingMember,
      error: null, // Error handling is done in the action functions
    },
  };
};
