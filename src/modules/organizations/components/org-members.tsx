"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, AlertTriangle } from 'lucide-react';
import { useActiveOrg } from "@/modules/organizations";
import { useOrgInvite } from "../hooks/use-org-invite";
import { InviteMemberModal } from "./invite-member-modal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { OrgRole } from "../types";
import { Input } from "@/components/ui/input";

export function OrgMembers() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { 
    organization: org,
    members,
    isLoading,
    error,
    updateMemberRole,
    removeMember,
    currentUserRole
  } = useActiveOrg();

  const { 
    inviteMember,
    isInviting: isInvitingMember
  } = useOrgInvite({ organization: org, members: members || [] });

  const t = useTranslations('organizations');

  
  const initialQuery = searchParams.get("search") ?? "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  
  useEffect(() => {
  const params = new URLSearchParams(searchParams.toString());
  if (searchQuery) params.set("search", searchQuery);
  else params.delete("search");
  router.replace(`${pathname}?${params.toString()}`);
}, [searchQuery, pathname, router, searchParams]);

  
  const filteredMembers = useMemo(() => {
    if (!members || !searchQuery.trim()) return members || [];
    return members.filter((m) =>
      m.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<OrgRole>("member");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const handleRoleChange = async (memberId: string, newRole: OrgRole) => {
    if (!org) return;
    try {
      await updateMemberRole(memberId, newRole);
      toast.success(t('members.actions.roleUpdated'));
    } catch (error) {
      toast.error(t('members.actions.roleUpdateError'));
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!org) return;
    try {
      await removeMember(memberId);
      toast.success(t('members.actions.memberRemoved'));
    } catch (error) {
      toast.error(t('members.actions.memberRemoveError'));
    }
  };

  const handleInviteMember = async () => {
    if (!org || !newMemberEmail || !newMemberRole) return;
    const result = await inviteMember(newMemberEmail, newMemberRole);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(t('members.actions.invitationSent'));
    setNewMemberEmail("");
    setNewMemberRole("member");
    setIsInviteDialogOpen(false);
  };

  const handleClearSearch = () => setSearchQuery("");

  const getFallbackText = (name: string) =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);

  const canManageMembers = currentUserRole === "admin";

  if (!org) return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-center text-muted-foreground">{t('members.notFound')}</p>
      </CardContent>
    </Card>
  );

  if (error) return (
    <Card>
      <CardContent className="pt-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {typeof error === "string" ? error : t('members.loadError')}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('members.title')}</CardTitle>
        <CardDescription>{t('members.description')}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search input */}
        <div className="flex justify-between items-center">
          <Input
            placeholder={t("search.placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          {searchQuery && (
            <Button variant="ghost" onClick={handleClearSearch}>
              {t("search.clear")}
            </Button>
          )}
        </div>

        {/* Members header and invite button */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t('members.currentMembers')}</h3>
          {canManageMembers && (
            <Button onClick={() => setIsInviteDialogOpen(true)}>
              {t('members.inviteMember')}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t('members.loading')}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredMembers?.map(member => (
              <div key={member.user_id} className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getFallbackText(member.user_id)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{member.user_id}</p>
                    <p className="text-sm text-muted-foreground">{t('members.errors.unnamedUser')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {canManageMembers ? (
                    <Select 
                      value={member.role} 
                      onValueChange={(value: "admin" | "member") => handleRoleChange(member.user_id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder={t('members.inviteDialog.selectRole')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">{t('members.roles.admin')}</SelectItem>
                        <SelectItem value="member">{t('members.roles.member')}</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-sm text-muted-foreground px-3 py-1 bg-muted rounded-md">
                      {member.role}
                    </span>
                  )}

                  {canManageMembers && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t('members.actionsLabel')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteMember(member.user_id)} className="text-destructive">
                          {t('members.remove')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}

            {filteredMembers?.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchQuery ? t('search.noResults.title') : t('members.noMembers')}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter />

      <InviteMemberModal
        isOpen={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        email={newMemberEmail}
        onEmailChange={setNewMemberEmail}
        role={newMemberRole}
        onRoleChange={setNewMemberRole}
        isInviting={isInvitingMember}
        onInvite={handleInviteMember}
      />
    </Card>
  );
}
