"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { MoreHorizontal, AlertTriangle } from 'lucide-react'
import { useActiveOrganization } from "../hooks"
import { useOrganizationMembers, useUpdateMemberRole, useRemoveMember, useInviteMember } from "../hooks"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth/hooks"

export function OrgMembers() {
  const { activeOrganization: org } = useActiveOrganization();
  const { user } = useAuth();
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<"admin" | "member" | "owner">("member")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  const { data: membersData, isLoading, error } = useOrganizationMembers(org?.id || "");
  const updateRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();
  const inviteMember = useInviteMember();

  const members = membersData?.data || [];
  const currentUserRole = members.find(m => m.user_id === user?.id)?.role;

  const handleRoleChange = async (memberId: string, newRole: "admin" | "member" | "owner") => {
    if (!org) return;
    
    try {
      await updateRole.mutateAsync({
        orgId: org.id,
        memberId,
        newRole
      });
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    if (!org) return;
    
    try {
      await removeMember.mutateAsync({
        orgId: org.id,
        memberId
      });
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  }

  const handleInviteMember = async () => {
    if (!org || !newMemberEmail || !newMemberRole) return;
    
    try {
      await inviteMember.mutateAsync({
        orgId: org.id,
        email: newMemberEmail,
        role: newMemberRole
      });
      
      setNewMemberEmail("");
      setNewMemberRole("member");
      setIsInviteDialogOpen(false);
    } catch (error) {
      console.error("Failed to invite member:", error);
    }
  }

  const getFallbackText = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  }

  const canManageMembers = currentUserRole === "admin" || currentUserRole === "owner";

  if (!org) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Organization not found</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {typeof error === "string" && error === "Not a member of this organization" 
                ? "You are not a member of this organization." 
                : "Failed to load organization members."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Members</CardTitle>
        <CardDescription>Manage your organization members and their roles.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Current Members</h3>
          {canManageMembers && (
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button>Invite Member</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Invite New Member</DialogTitle>
                  <DialogDescription>
                    Enter the email and assign a role for the new organization member.
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
                    <Select value={newMemberRole} onValueChange={(value: "admin" | "member" | "owner") => setNewMemberRole(value)}>
                      <SelectTrigger id="role" className="col-span-3">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleInviteMember}
                    disabled={inviteMember.isPending}
                  >
                    {inviteMember.isPending ? "Inviting..." : "Invite"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading members...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {members.map(member => (
              <div key={member.user_id} className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getFallbackText(member.user_id)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{member.user_id}</p>
                    <p className="text-sm text-muted-foreground">User ID</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canManageMembers ? (
                    <Select 
                      value={member.role} 
                      onValueChange={(value: "admin" | "member" | "owner") => handleRoleChange(member.user_id, value)}
                      disabled={member.role === "owner"}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-sm text-muted-foreground px-3 py-1 bg-muted rounded-md">
                      {member.role}
                    </span>
                  )}
                  
                  {canManageMembers && member.role !== "owner" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleDeleteMember(member.user_id)}
                          className="text-destructive"
                        >
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
            
            {members.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No members found</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {/* No specific save button for members as changes are applied directly via selects/buttons */}
      </CardFooter>
    </Card>
  )
}
