import { create } from 'zustand';
import { Organization } from './types';

interface OrganizationsState {
  organizations: Organization[];
  activeOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setOrganizations: (organizations: Organization[]) => void;
  setActiveOrganization: (org: Organization | null) => void;
  addOrganization: (org: Organization) => void;
  updateOrganization: (orgId: string, updates: Partial<Organization>) => void;
  removeOrganization: (orgId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useOrganizationsStore = create<OrganizationsState>((set) => ({
  organizations: [],
  activeOrganization: null,
  isLoading: false,
  error: null,

  setOrganizations: (organizations) => set({ organizations }),
  
  setActiveOrganization: (org) => set({ activeOrganization: org }),
  
  addOrganization: (org) => set((state) => ({
    organizations: [...state.organizations, org]
  })),
  
  updateOrganization: (orgId, updates) => set((state) => ({
    organizations: state.organizations.map(org => 
      org.id === orgId ? { ...org, ...updates } : org
    ),
    activeOrganization: state.activeOrganization?.id === orgId 
      ? { ...state.activeOrganization, ...updates }
      : state.activeOrganization
  })),
  
  removeOrganization: (orgId) => set((state) => ({
    organizations: state.organizations.filter(org => org.id !== orgId),
    activeOrganization: state.activeOrganization?.id === orgId 
      ? null 
      : state.activeOrganization
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
}));
