"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslations } from "next-intl"
import {
  useMembersPage,
  MembersHeader,
  MembersSearchBar,
  MembersTable,
  InviteMemberModal,
  MembersPagination
} from "@/modules/organizations"

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
    org,
    paginatedMembers,
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
  } = useMembersPage();

  if (!org) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{t('errors.orgNotFound')}</h1>
        </div>
      </div>
    );
  }

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
          isLoading={isLoading}
          canManageMembers={canManageMembersRole}
          selectedMembers={selectedMembers}
          isAllSelected={isAllSelected}
          isUpdatingRole={updateRoleMutation.isPending}
          isRemovingMember={removeMemberMutation.isPending}
          onSelectAll={handleSelectAll}
          onSelectMember={handleSelectMember}
          onRoleChange={handleRoleChange}
          onDeleteMember={handleDeleteMember}
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
