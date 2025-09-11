import { TypedSupabaseClient } from "@/lib/supabase/type";
import { Organization, OrgUpdate, OrgWithMembers, OrgMember, OrgRole, Invite, InviteStatus } from "./types";
import { QueryClient, UndefinedInitialDataOptions } from "@tanstack/react-query";
import { 
  getUserOrgs, 
  getOrgBySlug, 
  getOrganizationMembers, 
  updateOrganization, 
  updateMemberRole, 
  removeMember, 
  leaveOrganization, 
  inviteMember,
  createOrg,
  isSlugUnique,
  deleteOrganization,
  getOrgInvites,
  updateInviteStatus,
  getUserInvites,
  updateUserInvite
} from "./actions";
import { isNullOrUndefined } from "@/lib/utils";

// Query keys
export const USER_ORGANIZATIONS_KEY = ["user-organizations"] as const;
export const ORGANIZATION_KEY = (orgId: string) => ["organization", orgId] as const;
export const ORGANIZATION_BY_SLUG_KEY = (slug: string) => ["organization-by-slug", slug] as const;
export const ORGANIZATION_MEMBERS_KEY = (orgId: string) => ["organization-members", orgId] as const;
export const ORGANIZATION_INVITES_KEY = (orgId: string) => ["organization-invites", orgId] as const;
export const USER_INVITES_KEY = ["user-invites"] as const;

//TODO: rely on useReactQuery for queries options like staleTime gcTime an other generic caching options

// Get user organizations query
export const getUserOrganizationsQueryOptions: () =>
  UndefinedInitialDataOptions<OrgWithMembers[] | null> =
  () => ({
    queryKey: USER_ORGANIZATIONS_KEY,
    queryFn: async () => {
      const result = await getUserOrgs();
      
      if (isNullOrUndefined(result)) {
        return null;
      }
      
      return result;

    },
  });

// Get organization by ID query
export const getOrganizationQueryOptions = (orgId: string): UndefinedInitialDataOptions<OrgWithMembers | null> => ({
  queryKey: ORGANIZATION_KEY(orgId),
  queryFn: async () => {
    // This would need a getOrganization action to be implemented
    // For now, we'll use the user organizations query and filter
    const result = await getUserOrgs();
    
    if (isNullOrUndefined(result)) {
      return null;
    }
    
    return result.find(org => org.id === orgId) || null;
  },
  enabled: !!orgId,
});

// Get organization by slug query
export const getOrganizationBySlugQueryOptions = (slug: string): UndefinedInitialDataOptions<Organization | null> => ({
  queryKey: ORGANIZATION_BY_SLUG_KEY(slug),
  queryFn: async () => {
    const result = await getOrgBySlug(slug);
    
    if (result?.error) {
      throw new Error(typeof result.error === 'string' ? result.error : 'Unknown error');
    }
    
    return result?.data || null;
  },
  enabled: !!slug,
});

// Get organization members query
export const getOrganizationMembersQueryOptions = (orgId: string): UndefinedInitialDataOptions<OrgMember[] | null> => ({
  queryKey: ORGANIZATION_MEMBERS_KEY(orgId),
  queryFn: async () => {
    const result = await getOrganizationMembers(orgId);
    
    if (result?.error) {
      throw new Error(typeof result.error === 'string' ? result.error : 'Unknown error');
    }
    
    return result?.data || null;
  },
  enabled: !!orgId,
});

// Create organization mutation
export const createOrganizationMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async (newOrg: Parameters<typeof createOrg>[0]) => 
    await createOrg(newOrg),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: USER_ORGANIZATIONS_KEY });
  },
});

// Update organization mutation
export const updateOrganizationMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async ({ orgId, updates }: { orgId: string; updates: OrgUpdate }) => 
    await updateOrganization(orgId, updates),
  onSuccess: (data: { data?: unknown; error?: string } | null, { orgId, updates }: { orgId: string; updates: OrgUpdate }) => {
    if (!data?.error && data?.data) {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEY(orgId) });
      queryClient.invalidateQueries({ queryKey: USER_ORGANIZATIONS_KEY });
      
      // If slug was updated, invalidate the old slug query
      // TODO: the check doesn't look right
      if (updates.slug && typeof data.data === 'object' && 'slug' in data.data) {
        const oldSlug = (data.data as { slug: string }).slug;
        queryClient.invalidateQueries({ queryKey: ORGANIZATION_BY_SLUG_KEY(oldSlug) });
      }
    }
  },
});

// Update member role mutation
export const updateMemberRoleMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async ({ 
    orgId, 
    memberId, 
    newRole 
  }: { 
    orgId: string; 
    memberId: string; 
    newRole: OrgRole
  }) => await updateMemberRole(orgId, memberId, newRole),
  onSuccess: (data: { data?: unknown; error?: string } | null, { orgId }: { orgId: string }) => {
    if (!data?.error) {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_MEMBERS_KEY(orgId) });
    }
  },
});

// Remove member mutation
export const removeMemberMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async ({ 
    orgId, 
    memberId 
  }: { 
    orgId: string; 
    memberId: string 
  }) => await removeMember(orgId, memberId),
  onSuccess: (data: { success?: boolean; error?: string } | null, { orgId }: { orgId: string }) => {
    if (!data?.error) {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_MEMBERS_KEY(orgId) });
    }
  },
});

// Leave organization mutation
export const leaveOrganizationMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async ({ orgId }: { orgId: string }) => 
    await leaveOrganization(orgId),
  onSuccess: (data: { success?: boolean; error?: string } | null) => {
    if (!data?.error) {
      queryClient.invalidateQueries({ queryKey: USER_ORGANIZATIONS_KEY });
    }
  },
});

// Invite member mutation
export const inviteMemberMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async ({ 
    orgId, 
    email, 
    role,
    orgName
  }: { 
    orgId: string; 
    email: string; 
    role: OrgRole;
    orgName: string;
  }) => await inviteMember(orgId, orgName, email, role),
  onSuccess: (data: { data?: unknown; error?: string } | null, { orgId }: { orgId: string }) => {
    if (!data?.error) {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_MEMBERS_KEY(orgId) });
    }
  },
});

// Check slug uniqueness mutation
export const checkSlugUniquenessMutationOptions = () => ({
  mutationFn: async (slug: string) => await isSlugUnique(slug),
});

// Delete organization mutation
export const deleteOrganizationMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async (orgId: string) => await deleteOrganization(orgId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: USER_ORGANIZATIONS_KEY });
  },
});

// Get organization invites query
export const getOrganizationInvitesQueryOptions = (orgId: string): UndefinedInitialDataOptions<Invite[] | null> => ({
  queryKey: ORGANIZATION_INVITES_KEY(orgId),
  queryFn: async () => {
    const result = await getOrgInvites(orgId);
    
    if (result?.error) {
      throw new Error(typeof result.error === 'string' ? result.error : 'Unknown error');
    }
    
    return result?.data || null;
  },
  enabled: !!orgId,
});

// Update invite status mutation
export const updateInviteStatusMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async ({ 
    inviteId, 
    status 
  }: { 
    inviteId: string; 
    status: InviteStatus 
  }) => await updateInviteStatus(inviteId, status),
  onSuccess: (data: { data?: Invite; error?: string } | null) => {
    if (!data?.error && data?.data) {
      // Invalidate invites for the organization
      const orgId = data.data.organization_id;
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_INVITES_KEY(orgId) });
    }
  },
});

// Get user invites query
export const getUserInvitesQueryOptions: () => UndefinedInitialDataOptions<Invite[] | null> = () => ({
  queryKey: USER_INVITES_KEY,
  queryFn: async () => {
    const result = await getUserInvites();
    
    if (result?.error) {
      throw new Error(typeof result.error === 'string' ? result.error : 'Unknown error');
    }
    
    return result?.data || null;
  },
});

// Update user invite mutation
export const updateUserInviteMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async ({ 
    inviteId, 
    status 
  }: { 
    inviteId: string; 
    status: "accepted" | "rejected" 
  }) => await updateUserInvite(inviteId, status),
  onSuccess: (data: { data?: Invite; error?: string } | null) => {
    if (!data?.error) {
      // Invalidate user invites to refresh the list
      queryClient.invalidateQueries({ queryKey: USER_INVITES_KEY });
      // Also invalidate user organizations in case they accepted an invite
      queryClient.invalidateQueries({ queryKey: USER_ORGANIZATIONS_KEY });
    }
  },
});

// Utility function for getting organization by slug (for server-side use)
export const getOrganizationBySlug = async (supabase: TypedSupabaseClient, slug: string) => {
  return await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();
};
