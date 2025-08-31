"use client";

import { ReactNode, useEffect } from 'react';
import { Organization } from '../types';
import { useOrganizationsStore } from '../store';

interface OrganizationsStoreInitializerProps {
  children: ReactNode;
  initialOrg: Organization;
}

export function OrganizationsStoreInitializer({ children, initialOrg }: OrganizationsStoreInitializerProps) {
  const { setActiveOrganization } = useOrganizationsStore();

  useEffect(() => {
    setActiveOrganization(initialOrg);
    
    // Cleanup when component unmounts
    return () => {
      setActiveOrganization(null);
    };
  }, [initialOrg, setActiveOrganization]);

  return <>{children}</>;
}
