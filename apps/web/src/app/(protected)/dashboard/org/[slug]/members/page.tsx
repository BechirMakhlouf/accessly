"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslations } from "next-intl"
import {
  useMembersPage,
  MembersHeader,
  MembersSearchBar,
  InviteMemberModal,
  MembersPagination
} from "@/modules/organizations"
import { MembersTable } from "@/modules/organizations/components/members-table"
export default function MembersPage() {
  const t = useTranslations("org.members");

  const {
    // State
    searchQuery,
    setSearchQuery,
    selectedMembers,
    currentPage,
    setCurrentPage,
    isInviteModalOpen,
    setIsInviteModalOpen,
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,

    // Data
    paginatedMembers,
    canManageMembersRole,
    isLoading,
    error,
    filteredInvites,
    revokeInvite,
    isRevoking,

    // Computed values
    totalPages,
    startIndex,
    totalFilteredMembers,
    isAllSelected,

    // Actions
    handleInviteMember,
    handleBulkDelete,
    handleRoleChange,
    handleDeleteMember,
    handleSelectAll,
    handleSelectMember,

    // Mutations
    removeMemberMutation,
    inviteMemberMutation,
    updateRoleMutation,
  } = useMembersPage();

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('errors.loadError')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        <MembersHeader
          canManageMembers={canManageMembersRole}
          onInviteClick={() => setIsInviteModalOpen(true)}
        />

        <MembersSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedMembersCount={selectedMembers.length}
          canManageMembers={canManageMembersRole}
          isDeleting={removeMemberMutation.isPending}
          onBulkDelete={handleBulkDelete}
        />

        <MembersTable
          members={paginatedMembers}
          invitedMembers={filteredInvites}
          isLoading={isLoading}
          canManageMembers={canManageMembersRole}
          selectedMembers={selectedMembers}
          isAllSelected={isAllSelected}
          isUpdatingRole={updateRoleMutation.isPending}
          isRemovingMember={removeMemberMutation.isPending}
          isRevokingInvite={isRevoking}
          showExpiredInvites={false}
          onSelectAll={handleSelectAll}
          onSelectMember={handleSelectMember}
          onRoleChange={handleRoleChange}
          onDeleteMember={handleDeleteMember}
          onRevokeInvite={(inviteId) => revokeInvite(inviteId)}
          onToggleExpiredInvites={() => { }}
          searchQuery={searchQuery}
        />
        <MembersPagination
          totalPages={totalPages}
          currentPage={currentPage}
          startIndex={startIndex}
          itemsPerPage={10}
          totalItems={totalFilteredMembers}
          onPageChange={setCurrentPage}
        />

        <InviteMemberModal
          isOpen={isInviteModalOpen}
          onOpenChange={setIsInviteModalOpen}
          email={inviteEmail}
          onEmailChange={setInviteEmail}
          role={inviteRole}
          onRoleChange={setInviteRole}
          isInviting={inviteMemberMutation.isPending}
          onInvite={handleInviteMember}
        />
      </div>
    </div>
  )
}
