import { TypedSupabaseClient } from "@/lib/supabase/type";
import { Organization, OrganizationUpdate, OrganizationWithMembers, OrgMember, OrgRole } from "./types";
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
  createOrgWithoutSlug,
  isSlugUnique
} from "./actions";
import { isNullOrUndefined } from "@/lib/utils";

// Query keys
export const USER_ORGANIZATIONS_KEY = ["user-organizations"] as const;
export const ORGANIZATION_KEY = (orgId: string) => ["organization", orgId] as const;
export const ORGANIZATION_BY_SLUG_KEY = (slug: string) => ["organization-by-slug", slug] as const;
export const ORGANIZATION_MEMBERS_KEY = (orgId: string) => ["organization-members", orgId] as const;

//TODO: rely on useReactQuery for queries options like staleTime gcTime an other generic caching options

// Get user organizations query
export const getUserOrganizationsQueryOptions: () =>
  UndefinedInitialDataOptions<OrganizationWithMembers[] | null> =
  () => ({
    queryKey: USER_ORGANIZATIONS_KEY,
    queryFn: async () => {
      const result = await getUserOrgs();
      
      if (isNullOrUndefined(result)) {
        return null;
      }
      
      return result;

    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

// Get organization by ID query
export const getOrganizationQueryOptions = (orgId: string): UndefinedInitialDataOptions<OrganizationWithMembers | null> => ({
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
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
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
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
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
  staleTime: 2 * 60 * 1000, // 2 minutes for members (more dynamic)
  gcTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});

// Create organization mutation
export const createOrganizationMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async (newOrg: Parameters<typeof createOrgWithoutSlug>[0]) => 
    await createOrgWithoutSlug(newOrg),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: USER_ORGANIZATIONS_KEY });
  },
});

// Update organization mutation
export const updateOrganizationMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async ({ orgId, updates }: { orgId: string; updates: OrganizationUpdate }) => 
    await updateOrganization(orgId, updates),
  onSuccess: (data: { data?: unknown; error?: string } | null, { orgId }: { orgId: string }) => {
    if (!data?.error) {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEY(orgId) });
      queryClient.invalidateQueries({ queryKey: USER_ORGANIZATIONS_KEY });
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
    newRole: "admin" | "member" 
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
    role 
  }: { 
    orgId: string; 
    email: string; 
    role: OrgRole 
  }) => await inviteMember(orgId, email, role),
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

// Utility function for getting organization by slug (for server-side use)
export const getOrganizationBySlug = async (supabase: TypedSupabaseClient, slug: string) => {
  return await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();
};
