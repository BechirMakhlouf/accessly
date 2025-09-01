"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react'
import { OrgMember, OrgRole } from '@/modules/organizations/types'

export function OrgMembers() {
  const [members, setMembers] = useState<OrgMember[]>([])
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<OrgRole>("member")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  const handleRoleChange = (id: string, newRole: OrgRole) => {
    setMembers(members.map(member => (member.user_id === id ? { ...member, role: newRole } : member)))
    console.log(`Changed role for ${id} to ${newRole}`)
  }

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(member => member.user_id !== id))
    console.log(`Deleted member ${id}`)
  }

  const handleInviteMember = () => {
    if (newMemberEmail && newMemberRole) {
      const newMember: OrgMember = {
        user_id: String(members.length + 1), // Simple ID generation
        role: newMemberRole,
        joined_at: new Date().toISOString(),
        last_active_at: null,
        email: newMemberEmail,
        profiles: {
          id: String(members.length + 1),
          full_name: newMemberEmail.split("@")[0], // Basic name from email
          avatar_url: "/placeholder.svg?height=32&width=32",
        }
      }
      setMembers([...members, newMember])
      setNewMemberEmail("")
      setNewMemberRole("member")
      setIsInviteDialogOpen(false)
      console.log("Invited new member:", newMember)
    }
  }

  const getFallbackText = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Manage your team members and their roles.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Current Members</h3>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>Invite Member</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite New Member</DialogTitle>
                <DialogDescription>
                  Enter the email and assign a role for the new team member.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="member@example.com"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select value={newMemberRole} onValueChange={(value: OrgRole) => setNewMemberRole(value)}>
                    <SelectTrigger id="role" className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleInviteMember}>Invite</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {members.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No team members yet. Invite your first member to get started.</p>
            </div>
          ) : (
            members.map(member => (
              <div key={member.user_id} className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.profiles?.avatar_url || "/placeholder.svg"} alt={`@${member.profiles?.full_name || member.email}`} />
                    <AvatarFallback>{getFallbackText(member.profiles?.full_name || member.email || "")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-none">{member.profiles?.full_name || member.email}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={member.role} onValueChange={(value: OrgRole) => handleRoleChange(member.user_id, value)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDeleteMember(member.user_id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        {/* No specific save button for members as changes are applied directly via selects/buttons */}
      </CardFooter>
    </Card>
  )
}
