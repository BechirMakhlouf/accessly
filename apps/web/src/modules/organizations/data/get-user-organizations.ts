import 'server-only';

import { getUserOrgs } from '../actions';
import type { OrgWithMembers } from '../types';

type GetUserOrganizationsOptions = {
  search?: string;
};

export async function getUserOrganizations(
  options: GetUserOrganizationsOptions = {}
): Promise<OrgWithMembers[]> {
  const organizations = await getUserOrgs();

  if (!organizations) {
    return [];
  }

  const { search } = options;
  if (!search?.trim()) {
    return organizations;
  }

  const query = search.trim().toLowerCase();
  return organizations.filter(
    org =>
      org.name.toLowerCase().includes(query) ||
      org.description?.toLowerCase().includes(query) ||
      org.slug.toLowerCase().includes(query)
  );
}
