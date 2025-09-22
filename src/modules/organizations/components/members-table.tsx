"use client";
import { useState } from "react";
import { Loader2, MoreHorizontal, Trash2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { OrgRole, useMembersPage } from "@/modules/organizations";
import { useFormatRelativeDate } from "@/lib/utils/date-utils";
import { InviteWithInviter, OrgMemberWithProfile, InviteStatus } from "../types";
import { useOrgInvite } from "../hooks/use-org-invite";
import { isInviteExpired, getInviteStatus, canRevokeInvite, isInviteResolved } from "../utils";

interface MembersTableProps {
  members: OrgMemberWithProfile[];
  invitedMembers: InviteWithInviter[];
  isLoading: boolean;
  canManageMembers: boolean;
  selectedMembers: string[];
  isAllSelected: boolean;
  isUpdatingRole: boolean;
  isRemovingMember: boolean;
  isRevokingInvite: boolean;
  showExpiredInvites: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectMember: (memberId: string, checked: boolean) => void;
  onRoleChange: (memberId: string, newRole: OrgRole) => void;
  onDeleteMember: (memberId: string) => void;
  onRevokeInvite: (inviteId: string) => void;
  onToggleExpiredInvites: () => void;
  searchQuery: string;
}

export const MembersTable = ({
  members,
  invitedMembers,
  isLoading,
  canManageMembers,
  selectedMembers,
  isAllSelected,
  isUpdatingRole,
  isRemovingMember,
  isRevokingInvite,
  onSelectAll,
  onSelectMember,
  onRoleChange,
  onDeleteMember,
  onRevokeInvite,
  searchQuery,
}: MembersTableProps) => {
  const t = useTranslations("org.members");

  // Filter invites based on resolved status
  const filteredInvitedMembers = invitedMembers.filter((invite) => {
    return !isInviteResolved(invite);
  });

  if (isLoading) {
    return (
      <div className="border border-border rounded-lg">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {canManageMembers && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={onSelectAll}
                    aria-label={t("table.selectAll")}
                  />
                </TableHead>
              )}
              <TableHead>{t("table.member")}</TableHead>
              <TableHead>{t("table.email")}</TableHead>
              <TableHead>{t("table.role")}</TableHead>
              <TableHead>{t("tableHeaders.joined")}</TableHead>
              {canManageMembers && <TableHead className="w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 && filteredInvitedMembers.length === 0
              ? (
                <TableRow>
                  <TableCell
                    colSpan={canManageMembers ? 6 : 5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchQuery
                      ? t("errors.noMembersMatchingSearch")
                      : t("errors.noMembersFound")}
                  </TableCell>
                </TableRow>
              )
              : (
                <>
                  {/* Member rows */}
                  {members.map((member) => (
                    <MemberRow
                      key={member.user_id}
                      member={member}
                      canManageMembers={canManageMembers}
                      selectedMembers={selectedMembers}
                      isUpdatingRole={isUpdatingRole}
                      isRemovingMember={isRemovingMember}
                      onSelectMember={onSelectMember}
                      onRoleChange={onRoleChange}
                      onDeleteMember={onDeleteMember}
                    />
                  ))}
                  {/* Invite rows */}
                  {filteredInvitedMembers.map((invite) => (
                    <InviteRow
                      key={invite.id}
                      invite={invite}
                      canManageMembers={canManageMembers}
                      isRevokingInvite={isRevokingInvite}
                      onRevokeInvite={onRevokeInvite}
                    />
                  ))}
                </>
              )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};


interface MemberRowProps {
  member: OrgMemberWithProfile;
  canManageMembers: boolean;
  selectedMembers: string[];
  isUpdatingRole: boolean;
  isRemovingMember: boolean;
  onSelectMember: (memberId: string, checked: boolean) => void;
  onRoleChange: (memberId: string, newRole: OrgRole) => void;
  onDeleteMember: (memberId: string) => void;
};

const MemberRow = ({ member, canManageMembers, selectedMembers, isUpdatingRole, isRemovingMember, onSelectMember, onRoleChange, onDeleteMember }: MemberRowProps) => {
  const t = useTranslations("org.members");
  const formatRelativeDate = useFormatRelativeDate();

  return (
    <TableRow key={member.user_id}>
      {canManageMembers && (
        <TableCell>
          <Checkbox
            checked={selectedMembers.includes(member.user_id)}
            onCheckedChange={(checked) =>
              onSelectMember(member.user_id, checked as boolean)}
            aria-label={`Select ${member.profile?.full_name}`}
          />
        </TableCell>
      )}
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={member.profile?.avatar_url || undefined}
              alt={member.profile?.full_name || "Member avatar"}
            />
            <AvatarFallback>
              <User className="text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">
            {member?.profile?.full_name}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {member.profile?.email}
      </TableCell>
      <TableCell>
        {canManageMembers
          ? (
            <Select
              value={member.role}
              onValueChange={(value: OrgRole) =>
                onRoleChange(member.user_id, value)}
              disabled={isUpdatingRole}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">
                  {t("roles.member")}
                </SelectItem>
                <SelectItem value="admin">
                  {t("roles.admin")}
                </SelectItem>
              </SelectContent>
            </Select>
          )
          : (
            <Badge variant="secondary">
              {t(`roles.${member.role}`)}
            </Badge>
          )}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatRelativeDate(member.joined_at)}
      </TableCell>
      {canManageMembers && (
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onDeleteMember(member.user_id)}
                className="text-destructive focus:text-destructive"
                disabled={isRemovingMember}
              >
                <Trash2 className="text-destructive h-4 w-4 mr-2" />
                {t("actions.deleteMember")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      )}
    </TableRow>
  );
};

interface InviteRowProps {
  invite: InviteWithInviter;
  canManageMembers: boolean;
  isRevokingInvite: boolean;
  onRevokeInvite: (inviteId: string) => void;
}

const InviteRow = ({ invite, canManageMembers, isRevokingInvite, onRevokeInvite }: InviteRowProps) => {
  const t = useTranslations("org.members");
  const formatRelativeDate = useFormatRelativeDate();

  const inviteStatus = getInviteStatus(invite);
  const isExpired = isInviteExpired(invite);
  const canRevoke = canRevokeInvite(invite);

  const getStatusBadgeVariant = (status: InviteStatus | "expired") => {
    switch (status) {
      case "pending":
        return "secondary";
      case "accepted":
        return "secondary";
      case "rejected":
        return "destructive";
      case "revoked":
        return "destructive";
      case "expired":
        return "outline";
      default:
        return "secondary";
    }
  };


  return (
    <TableRow key={invite.id} className={isExpired ? "opacity-60" : ""}>
      {canManageMembers && (
        <TableCell>
          {/* No checkbox for invites */}
        </TableCell>
      )}
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-foreground">
                {invite.email}
              </span>
              <Badge
                variant={getStatusBadgeVariant(inviteStatus)}
              >
                {t(`status.${inviteStatus}`)}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {t("table.invited")} by {invite.inviterProfile?.full_name || "Unknown"}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {invite.email}
      </TableCell>
      <TableCell>
        <Badge variant="secondary">
          {t(`roles.${invite.role}`)}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatRelativeDate(invite.created_at)}
      </TableCell>
      {canManageMembers && (
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canRevoke && (
                <DropdownMenuItem
                  onClick={() => onRevokeInvite(invite.id)}
                  className="text-destructive focus:text-destructive"
                  disabled={isRevokingInvite}
                >
                  <Trash2 className="text-destructive h-4 w-4 mr-2" />
                  {t("actions.revokeInvite")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      )}
    </TableRow>
  );
};

export const MembersTableWithState = () => {
  const {
    // State
    searchQuery,
    selectedMembers,

    // Data
    paginatedMembers,
    canManageMembersRole,
    isLoading,
    org,

    // Computed values
    isAllSelected,

    // Actions
    handleRoleChange,
    handleDeleteMember,
    handleSelectAll,
    handleSelectMember,

    // Mutations
    updateRoleMutation,
    removeMemberMutation,
  } = useMembersPage();

    const {
      invites,
      revokeInvite,
      isRevoking
    } = useOrgInvite({ organization: org, members: paginatedMembers });

  const invitedMembers = invites || [];
  const [showExpiredInvites, setShowExpiredInvites] = useState(false);

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      await revokeInvite(inviteId);
    } catch (error) {
      console.error("Failed to revoke invite:", error);
    }
  };

  const handleToggleExpiredInvites = () => {
    setShowExpiredInvites(!showExpiredInvites);
  };
  return (
    <MembersTable
      members={paginatedMembers}
      invitedMembers={invitedMembers}
      isLoading={isLoading}
      canManageMembers={canManageMembersRole}
      selectedMembers={selectedMembers}
      isAllSelected={isAllSelected}
      isUpdatingRole={updateRoleMutation.isPending}
      isRemovingMember={removeMemberMutation.isPending}
      isRevokingInvite={isRevoking}
      showExpiredInvites={showExpiredInvites}
      onSelectAll={handleSelectAll}
      onSelectMember={handleSelectMember}
      onRoleChange={handleRoleChange}
      onDeleteMember={handleDeleteMember}
      onRevokeInvite={handleRevokeInvite}
      onToggleExpiredInvites={handleToggleExpiredInvites}
      searchQuery={searchQuery}
    />
  );
}