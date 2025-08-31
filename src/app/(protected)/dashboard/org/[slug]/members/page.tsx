"use client"

import { useState } from "react"
import { Search, Plus, MoreHorizontal, Trash2, Mail, User } from "lucide-react"
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
import { useActiveOrg } from "@/modules/organizations/provider"
import { useTranslations } from "next-intl"

// Mock data for demonstration
//TODO: remove dummy data
const mockMembers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=32&width=32",
    joinedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "member",
    avatar: "/placeholder.svg?height=32&width=32",
    joinedAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "member",
    avatar: "/placeholder.svg?height=32&width=32",
    joinedAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=32&width=32",
    joinedAt: "2024-01-25",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    role: "member",
    avatar: "/placeholder.svg?height=32&width=32",
    joinedAt: "2024-04-05",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "member",
    avatar: "/placeholder.svg?height=32&width=32",
    joinedAt: "2024-04-12",
  },
  {
    id: "7",
    name: "Alex Thompson",
    email: "alex.thompson@example.com",
    role: "member",
    avatar: "/placeholder.svg?height=32&width=32",
    joinedAt: "2024-04-18",
  },
  {
    id: "8",
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=32&width=32",
    joinedAt: "2024-02-28",
  },
]

export default function MembersPage() {
  const { org } = useActiveOrg();
  const t = useTranslations("org.members");
  
  const [members, setMembers] = useState(mockMembers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")

  const itemsPerPage = 5

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage)

  // Handle role change
  const handleRoleChange = (memberId: string, newRole: string) => {
    setMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, role: newRole } : member)))
  }

  // Handle member deletion
  const handleDeleteMember = (memberId: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== memberId))
    setSelectedMembers((prev) => prev.filter((id) => id !== memberId))
  }

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(paginatedMembers.map((member) => member.id))
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
    // Here you would typically send an API request to invite the member
    console.log(`Inviting ${inviteEmail} as ${inviteRole}`)
    setIsInviteModalOpen(false)
    setInviteEmail("")
    setInviteRole("member")
    // You could add a toast notification here
  }

  const isAllSelected = paginatedMembers.length > 0 && selectedMembers.length === paginatedMembers.length

  if (!org) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Organization not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
          <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t("inviteMember")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("inviteModal.title")}</DialogTitle>
                <DialogDescription>{t("inviteModal.description")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("inviteModal.emailLabel")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("inviteModal.emailPlaceholder")}
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t("inviteModal.roleLabel")}</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">{t("roles.member")}</SelectItem>
                      <SelectItem value="admin">{t("roles.admin")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
                  {t("inviteModal.cancel")}
                </Button>
                <Button onClick={handleInviteMember} disabled={!inviteEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  {t("inviteModal.sendInvite")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {selectedMembers.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{t("selected", { count: selectedMembers.length })}</Badge>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                {t("deleteSelected")}
              </Button>
            </div>
          )}
        </div>

        {/* Members Table */}
        <div className="border border-border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} aria-label={t("table.selectAll")} />
                </TableHead>
                <TableHead>{t("table.member")}</TableHead>
                <TableHead>{t("table.email")}</TableHead>
                <TableHead>{t("table.role")}</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={(checked) => handleSelectMember(member.id, checked as boolean)}
                      aria-label={`Select ${member.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>
                          <User className="text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.email}</TableCell>
                  <TableCell>
                    <Select value={member.role} onValueChange={(value) => handleRoleChange(member.id, value)}>
                      <SelectTrigger className="w-32 text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">{t("roles.member")}</SelectItem>
                        <SelectItem value="admin">{t("roles.admin")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
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
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="text-destructive h-4 w-4 mr-2" />
                          {t("actions.deleteMember")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t("showing", { 
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
                {t("previous")}
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
                {t("next")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
