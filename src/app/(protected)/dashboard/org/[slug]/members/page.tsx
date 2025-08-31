"use client"

import { useState } from "react"
import { Search, Plus, MoreHorizontal, Trash2, Mail, User, AlertCircle, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useActiveOrganization } from "@/modules/organizations"
import { useTranslations } from "next-intl"
import { 
  useOrganizationMembers,
  useUpdateMemberRole,
  useRemoveMember,
  useInviteMember
} from "@/modules/organizations"

// Type for the member data returned from the API
interface Member {
  user_id: string
  role: "admin" | "member" | "owner"
  joined_at: string
  last_active_at: string | null
  profiles: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
  // Email will come from a different source since it's not in user_profiles
  email: string
}

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
};

export default function MembersPage() {
  const { activeOrganization: org } = useActiveOrganization();
  const t = useTranslations("org.members");
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member")

  const itemsPerPage = 10

  // Fetch organization members
  const { 
    data: membersData, 
    isLoading, 
    error 
  } = useOrganizationMembers(org?.id || "");

  const members = (membersData?.data || []) as Member[];
  const currentUserRole = members.find(m => m.user_id === org?.created_by)?.role;

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      (member.profiles.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage)

  // Mutations
  const updateRoleMutation = useUpdateMemberRole();
  const removeMemberMutation = useRemoveMember();
  const inviteMemberMutation = useInviteMember();

  // Handle role change
  const handleRoleChange = (memberId: string, newRole: "admin" | "member") => {
    if (!org) return;
    updateRoleMutation.mutate({ orgId: org.id, memberId, newRole });
  }

  // Handle member deletion
  const handleDeleteMember = (memberId: string) => {
    if (!org) return;
    removeMemberMutation.mutate({ orgId: org.id, memberId });
  }

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(paginatedMembers.map((member) => member.user_id))
    } else {
      setSelectedMembers([])
    }
  }

  // Handle individual selection
  const handleSelectMember = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers((prev) => [...prev, memberId])
    } else {
      setSelectedMembers((prev) => prev.filter((id) => id !== memberId))
    }
  }

  // Handle invite member
  const handleInviteMember = () => {
    if (!org || !inviteEmail.trim()) return;
    inviteMemberMutation.mutate({ 
      orgId: org.id, 
      email: inviteEmail.trim(), 
      role: inviteRole 
    });
    
    // Reset form
    setIsInviteModalOpen(false);
    setInviteEmail("");
    setInviteRole("member");
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedMembers.length === 0 || !org) return;
    selectedMembers.forEach(memberId => {
      removeMemberMutation.mutate({ orgId: org.id, memberId });
    });
    setSelectedMembers([]);
  }

  const isAllSelected = paginatedMembers.length > 0 && selectedMembers.length === paginatedMembers.length
  const canManageMembers = currentUserRole === "admin" || currentUserRole === "owner";

  if (!org) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{t('errors.orgNotFound')}</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('errors.loadError')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
            <p className="text-muted-foreground">
              {t('description')}
            </p>
          </div>
          {canManageMembers && (
            <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('inviteMember')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('inviteModal.title')}</DialogTitle>
                  <DialogDescription>
                    {t('inviteModal.description')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('inviteModal.emailLabel')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('inviteModal.emailPlaceholder')}
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      disabled={inviteMemberMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">{t('inviteModal.roleLabel')}</Label>
                    <Select value={inviteRole} onValueChange={(value: "admin" | "member") => setInviteRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">{t('roles.member')}</SelectItem>
                        <SelectItem value="admin">{t('roles.admin')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
                    {t('inviteModal.cancel')}
                  </Button>
                  <Button 
                    onClick={handleInviteMember} 
                    disabled={!inviteEmail.trim() || inviteMemberMutation.isPending}
                  >
                    {inviteMemberMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    {t('inviteModal.sendInvite')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {selectedMembers.length > 0 && canManageMembers && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{t('selected', { count: selectedMembers.length })}</Badge>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleBulkDelete}
                disabled={removeMemberMutation.isPending}
              >
                {removeMemberMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {t('deleteSelected')}
              </Button>
            </div>
          )}
        </div>

        {/* Members Table */}
        <div className="border border-border rounded-lg">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {canManageMembers && (
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={isAllSelected} 
                        onCheckedChange={handleSelectAll} 
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
                {paginatedMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canManageMembers ? 7 : 6} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? t('errors.noMembersMatchingSearch') : t('errors.noMembersFound')}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMembers.map((member) => (
                    <TableRow key={member.user_id}>
                      {canManageMembers && (
                        <TableCell>
                          <Checkbox
                            checked={selectedMembers.includes(member.user_id)}
                            onCheckedChange={(checked) => handleSelectMember(member.user_id, checked as boolean)}
                            aria-label={`Select ${member.profiles.full_name || member.email}`}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.profiles.avatar_url || undefined} alt={member.profiles.full_name || member.email} />
                            <AvatarFallback>
                              <User className="text-muted-foreground" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">
                            {member.profiles.full_name || t('errors.unnamedUser')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{member.email}</TableCell>
                      <TableCell>
                        {canManageMembers && member.role !== "owner" ? (
                          <Select 
                            value={member.role} 
                            onValueChange={(value: "admin" | "member") => handleRoleChange(member.user_id, value)}
                            disabled={updateRoleMutation.isPending}
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
                          <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                            {t(`roles.${member.role}`)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(member.joined_at)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {member.last_active_at 
                          ? formatDate(member.last_active_at)
                          : "Never"
                        }
                      </TableCell>
                      {canManageMembers && member.role !== "owner" && (
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
                                onClick={() => handleDeleteMember(member.user_id)}
                                className="text-destructive focus:text-destructive"
                                disabled={removeMemberMutation.isPending}
                              >
                                <Trash2 className="text-destructive h-4 w-4 mr-2" />
                                Delete Member
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
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t('showing', { 
                start: startIndex + 1, 
                end: Math.min(startIndex + itemsPerPage, filteredMembers.length), 
                total: filteredMembers.length 
              })}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                {t('previous')}
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                {t('next')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
