import { MoreHorizontal, Trash2, User, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { OrgRole, OrgMember } from "@/modules/organizations";
import { useFormatRelativeDate } from "@/lib/utils/date-utils";

interface MembersTableProps {
  members: OrgMember[];
  isLoading: boolean;
  canManageMembers: boolean;
  selectedMembers: string[];
  isAllSelected: boolean;
  isUpdatingRole: boolean;
  isRemovingMember: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectMember: (memberId: string, checked: boolean) => void;
  onRoleChange: (memberId: string, newRole: OrgRole) => void;
  onDeleteMember: (memberId: string) => void;
  searchQuery: string;
}

export const MembersTable = ({
  members,
  isLoading,
  canManageMembers,
  selectedMembers,
  isAllSelected,
  isUpdatingRole,
  isRemovingMember,
  onSelectAll,
  onSelectMember,
  onRoleChange,
  onDeleteMember,
  searchQuery,
}: MembersTableProps) => {
  const t = useTranslations("org.members");
  const formatRelativeDate = useFormatRelativeDate();

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
    <div className="border border-border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {canManageMembers && (
              <TableHead className="w-12">
                <Checkbox 
                  checked={isAllSelected} 
                  onCheckedChange={onSelectAll} 
                  aria-label={t('table.selectAll')} 
                />
              </TableHead>
            )}
            <TableHead>{t('table.member')}</TableHead>
            <TableHead>{t('table.email')}</TableHead>
            <TableHead>{t('table.role')}</TableHead>
            <TableHead>{t('tableHeaders.joined')}</TableHead>
            <TableHead>{t('tableHeaders.lastActive')}</TableHead>
            {canManageMembers && <TableHead className="w-12"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={canManageMembers ? 7 : 6} className="text-center py-8 text-muted-foreground">
                {searchQuery ? t('errors.noMembersMatchingSearch') : t('errors.noMembersFound')}
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <TableRow key={member.user_id}>
                {canManageMembers && (
                  <TableCell>
                    <Checkbox
                      checked={selectedMembers.includes(member.user_id)}
                      onCheckedChange={(checked) => onSelectMember(member.user_id, checked as boolean)}
                      aria-label={`Select ${member.user_id}`}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">
                      {member.user_id}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{member.user_id}</TableCell>
                <TableCell>
                  {canManageMembers ? (
                    <Select 
                      value={member.role} 
                      onValueChange={(value: OrgRole) => onRoleChange(member.user_id, value)}
                      disabled={isUpdatingRole}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">{t('roles.member')}</SelectItem>
                        <SelectItem value="admin">{t('roles.admin')}</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary">
                      {t(`roles.${member.role}`)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatRelativeDate(member.joined_at)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {member.last_active_at 
                    ? formatRelativeDate(member.last_active_at)
                    : t('errors.never')
                  }
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
                          {t('actions.deleteMember')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
