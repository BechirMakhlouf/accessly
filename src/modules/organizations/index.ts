// Components
export { OrganizationCard } from './components/org-card';
export { OrgMembers } from './components/org-members';
export { OrgSettings } from './components/org-settings';
export { NewOrgForm } from './components/new-org-form';
export { OrganizationsHeader } from './components/organizations-header';
export { OrganizationsGrid } from './components/organizations-grid';
export { OrganizationsEmptyState } from './components/organizations-empty-state';
export { OrganizationsLoadingState } from './components/organizations-loading-state';
export { MembersHeader } from './components/members-header';
export { MembersSearchBar } from './components/members-search-bar';
export { MembersTable } from './components/members-table';
export { InviteMemberModal } from './components/invite-member-modal';
export { MembersPagination } from './components/members-pagination';

export { useActiveOrganization } from './hooks/use-active-organization';
export { useUserOrganizations } from './hooks/use-user-organizations';
export { useOrganizationMembers } from './hooks/use-organization-members';
export { useOrganizationMutations } from './hooks/use-organization-mutations';
export { useMembersPage } from './hooks/use-members-page';



// Store - REMOVED: No longer using Zustand store

// Types
export type { 
  Organization,
  OrgInsert as OrganizationInsert,
  OrgUpdate as OrganizationUpdate,
  OrgMember as OrganizationMembership,
  OrgInsertWithOptionalSlug as OrganizationInsertWithOptionalSlug,
  OrgMember,
  OrgRole
} from './types';

// Utility functions
export { isAdminRole, canManageMembers } from './utils';

// Actions
export {
  getOrgBySlug,
  createOrgWithoutSlug,
  isSlugUnique,
  genUniqueOrgSlug,
  getUserOrgs,
  updateOrganization,
  getOrganizationMembers,
  updateMemberRole,
  removeMember,
  leaveOrganization,
  inviteMember
} from './actions';
