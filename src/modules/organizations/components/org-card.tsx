import { MoreHorizontal, Users, Calendar, Crown, LogOut } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Organization } from '../types'
import { routes } from '@/lib/routes'
import { useLeaveOrganization } from '../hooks'
import { toast } from 'sonner'

interface OrganizationWithMembers extends Organization {
  organization_members: {
    user_id: string
    role: "admin" | "member" | "owner"
    joined_at: string
    last_active_at: string | null
  }[]
}

interface OrganizationCardProps {
  organization: OrganizationWithMembers
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const leaveOrg = useLeaveOrganization()
  
  // Get member count from the organization_members array
  const memberCount = organization.organization_members?.length || 0
  
  // Check if current user is owner (has admin role)
  const isOwner = organization.organization_members?.some(member => 
    member.role === 'owner'
  ) || false

  // Format creation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const handleLeaveOrganization = async () => {
    try {
      await leaveOrg.mutateAsync({ orgId: organization.id })
      setShowLeaveDialog(false)
    } catch (error) {
      console.error("Failed to leave organization:", error)
    }
  }

  return (
    <>
      <Card className="group relative overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={organization.icon_url || "/placeholder.svg"} alt={organization.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {organization.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-base leading-none">
                    <Link href={routes.protected.dashboard.org.slug.root(organization.slug || '')} className="hover:underline">
                      {organization.name}
                    </Link>
                  </CardTitle>
                  {isOwner && (
                    <Crown className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {organization.slug}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href={routes.protected.dashboard.org.slug.root(organization.slug || '')}>
                    View organization
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={routes.protected.dashboard.org.slug.settings.root(organization.slug || '')}>
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => setShowLeaveDialog(true)}
                  disabled={isOwner}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave organization
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="mb-4 line-clamp-2">
            {organization.description || 'No description provided'}
          </CardDescription>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(organization.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave "{organization.name}"? You will lose access to this organization and all its resources.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLeaveOrganization}
              disabled={leaveOrg.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {leaveOrg.isPending ? "Leaving..." : "Leave Organization"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
