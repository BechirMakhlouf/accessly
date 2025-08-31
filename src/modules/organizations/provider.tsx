"use client";

import React, { createContext, useContext, useState } from 'react';
import { Organization } from './types';

type ActiveOrgContextValue = {
  org: Organization | null;
  setOrg: (o: Organization | null) => void;
};

const ActiveOrgContext = createContext<ActiveOrgContextValue | undefined>(undefined);

export function ActiveOrgProvider({ children, initialOrg }: { children: React.ReactNode; initialOrg: Organization | null }) {
  const [org, setOrg] = useState<Organization | null>(initialOrg ?? null);

  return (
    <ActiveOrgContext.Provider value={{ org, setOrg }}>
      {children}
    </ActiveOrgContext.Provider>
  );
}

export function useActiveOrg() {
  const ctx = useContext(ActiveOrgContext);
  if (!ctx) throw new Error('useActiveOrg must be used within an ActiveOrgProvider');
  return ctx;
}

export default ActiveOrgProvider;


