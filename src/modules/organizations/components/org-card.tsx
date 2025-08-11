import { MoreHorizontal, Users, Calendar, Crown } from 'lucide-react'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Organization {
  id: string
  name: string
  description: string
  plan: "Free" | "Pro" | "Team" | "Enterprise"
  members: number
  projects: number
  createdAt: string
  avatar?: string
  isOwner: boolean
}

interface OrganizationCardProps {
  organization: Organization
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const planColors = {
    Free: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    Pro: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Team: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Enterprise: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
  }

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={organization.avatar || "/placeholder.svg"} alt={organization.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {organization.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-base leading-none">
                  <Link
                    href={`/organizations/${organization.id}`}
                    className="hover:underline"
                  >
                    {organization.name}
                  </Link>
                </CardTitle>
                {organization.isOwner && (
                  <Crown className="h-3 w-3 text-yellow-500" />
                )}
              </div>
              <Badge variant="secondary" className={planColors[organization.plan]}>
                {organization.plan}
              </Badge>
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
                <Link href={`/organizations/${organization.id}`}>
                  View organization
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/organizations/${organization.id}/settings`}>
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Leave organization
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="mb-4 line-clamp-2">
          {organization.description}
        </CardDescription>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{organization.members} members</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>{organization.projects} projects</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{organization.createdAt}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
