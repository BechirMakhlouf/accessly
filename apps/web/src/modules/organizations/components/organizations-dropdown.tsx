'use client';

import type { ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  Check,
  ChevronsUpDown,
  Plus,
  Search,
  Building2,
  Crown,
  Users,
  Mail,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/routes';
import type { Organization, Invite } from '@/modules/organizations';
import {
  useActiveOrg,
  useUserOrgs,
  useUserInvites,
} from '@/modules/organizations';
import { useAuth } from '@/lib/auth';
import { useFormatRelativeDate } from '@/lib/utils/date-utils';
import { useTranslations } from 'next-intl';
import type { InviteStatusOrExpired } from '../types';

export function OrganizationsDropdown({
  trigger,
}: { trigger?: ReactNode } = {}) {
  const router = useRouter();
  const { user } = useAuth();
  const { organization: org, setActiveOrganization: setOrg } = useActiveOrg();
  const { organizations, isLoading } = useUserOrgs();
  const { invites, isLoading: invitesLoading } = useUserInvites();
  const formatRelativeDate = useFormatRelativeDate();
  const t = useTranslations('organizations');
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      // Small delay to ensure the popover is fully rendered
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Filter organizations based on search query
  const filteredOrganizations =
    organizations?.filter(
      org =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.slug.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Filter invites based on search query
  const filteredInvites =
    invites?.filter(
      invite =>
        invite.organization.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        invite.organization.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        invite.organization.slug
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        invite.inviterProfile?.full_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    ) || [];

  const handleSelectOrganization = (selectedOrg: Organization) => {
    setOrg(selectedOrg);
    setOpen(false);
    setSearchQuery('');

    // Navigate to the selected organization
    router.push(
      routes.protected.dashboard.org.slug.root(selectedOrg.slug || '')
    );
  };

  const handleAddOrganization = () => {
    setOpen(false);
    setSearchQuery('');
    router.push(routes.protected.dashboard.organizations.new);
  };

  const handleViewAllOrganizations = () => {
    setOpen(false);
    setSearchQuery('');
    router.push(routes.protected.dashboard.organizations.root);
  };

  const handleSelectInvite = (inviteId: string) => {
    setOpen(false);
    setSearchQuery('');
    router.push(routes.invite.inviteId.root(inviteId));
  };

  const getMemberCount = (org: Organization) => {
    // If the organization has members data, use it, otherwise show 0
    if (
      'organization_members' in org &&
      Array.isArray(org.organization_members)
    ) {
      return org.organization_members.length;
    }
    return 0;
  };

  const getUserRole = (org: Organization) => {
    // If the organization has members data, find the current user's role
    if (
      'organization_members' in org &&
      Array.isArray(org.organization_members) &&
      user
    ) {
      const membership = org.organization_members.find(
        (m: { user_id: string; role: string }) => m.user_id === user.id
      );
      return membership?.role || 'member';
    }
    return 'member';
  };

  const getInviteStatus = (invite: Invite): InviteStatusOrExpired => {
    const now = new Date();
    const expiresAt = new Date(invite.expires_at);
    if (now > expiresAt) {
      return 'expired';
    }
    return invite.status;
  };

  const getInviteStatusBadgeVariant = (status: InviteStatusOrExpired) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'accepted':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      case 'revoked':
        return 'destructive';
      case 'expired':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (!user) {
    return null; // Don't show dropdown if user is not authenticated
  }

  // Default trigger with organization name
  const defaultTrigger = (
    <Button
      variant='ghost'
      className='h-8 px-2 gap-2 shrink-0 data-[state=open]:bg-accent max-w-[50vw] sm:max-w-[320px]'
      aria-label='Switch organization'
    >
      <span className='truncate text-sm leading-none text-muted-foreground'>
        {org ? org.name : t('selectOrganization')}
      </span>
      <ChevronsUpDown className='size-4 opacity-60 shrink-0' />
    </Button>
  );

  if (
    (isLoading || invitesLoading) &&
    (!organizations || organizations.length === 0) &&
    (!invites || invites.length === 0)
  ) {
    return (
      <div className='w-full max-w-sm'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{trigger ?? defaultTrigger}</PopoverTrigger>
          <PopoverContent className='w-full p-0' align='start'>
            <div className='p-4 text-center text-sm text-muted-foreground'>
              Loading organizations...
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className='w-full max-w-sm'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger ?? defaultTrigger}</PopoverTrigger>
        <PopoverContent className='w-full p-0' align='start'>
          <div className='p-2'>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                ref={searchInputRef}
                placeholder='Search organizations...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-8'
              />
            </div>
          </div>

          <div className='max-h-60 overflow-y-auto'>
            {/* Invites Section */}
            {filteredInvites.length > 0 && (
              <div className='p-1'>
                <div className='px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                  {t('invitations')}
                </div>
                {filteredInvites.map(invite => {
                  const inviteStatus = getInviteStatus(invite);
                  const isExpired = inviteStatus === 'expired';

                  if (inviteStatus === 'accepted') {
                    return null;
                  }
                  return (
                    <div
                      key={invite.id}
                      className='flex items-center gap-2 rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground'
                      onClick={() => handleSelectInvite(invite.id)}
                    >
                      <Mail className='h-4 w-4 text-muted-foreground' />
                      <div className='flex flex-col flex-1 min-w-0'>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium truncate'>
                            {invite.organization.name}
                          </span>
                          <Badge
                            variant={getInviteStatusBadgeVariant(inviteStatus)}
                            className={isExpired ? 'opacity-60' : ''}
                          >
                            {inviteStatus}
                          </Badge>
                        </div>
                        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                          <span className='truncate'>
                            {t('invitedBy')}{' '}
                            {invite.inviterProfile?.full_name || 'Unknown'}
                          </span>
                          <span>•</span>
                          <span>{formatRelativeDate(invite.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Organizations Section */}
            {filteredOrganizations.length > 0 ? (
              <div className='p-1'>
                {filteredOrganizations.length > 0 &&
                  filteredInvites.length > 0 && (
                    <div className='px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                      Organizations
                    </div>
                  )}
                {filteredOrganizations.map(organization => {
                  const isSelected = org?.id === organization.id;
                  const userRole = getUserRole(organization);
                  const memberCount = getMemberCount(organization);

                  return (
                    <div
                      key={organization.id}
                      className='flex items-center gap-2 rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground'
                      onClick={() => handleSelectOrganization(organization)}
                    >
                      <Building2 className='h-4 w-4 text-muted-foreground' />
                      <div className='flex flex-col flex-1 min-w-0'>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium truncate'>
                            {organization.name}
                          </span>
                          {userRole === 'admin' && (
                            <Crown className='h-3 w-3 flex-shrink-0' />
                          )}
                        </div>
                        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                          <span className='truncate'>{organization.slug}</span>
                          <span>•</span>
                          <span className='flex items-center gap-1'>
                            <Users className='h-3 w-3' />
                            {memberCount}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className='h-4 w-4 text-primary flex-shrink-0' />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              filteredInvites.length === 0 && (
                <div className='p-4 text-center text-sm text-muted-foreground'>
                  {searchQuery
                    ? 'No organizations or invitations found.'
                    : 'No organizations or invitations available.'}
                </div>
              )
            )}
          </div>

          <Separator />

          <div className='p-1 space-y-1'>
            <div
              className='flex items-center gap-2 rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground'
              onClick={handleAddOrganization}
            >
              <Plus className='h-4 w-4' />
              <span>Create organization</span>
            </div>

            {organizations && organizations.length > 0 && (
              <div
                className='flex items-center gap-2 rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground'
                onClick={handleViewAllOrganizations}
              >
                <Building2 className='h-4 w-4' />
                <span>View all organizations</span>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
