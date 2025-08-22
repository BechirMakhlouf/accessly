"use client"

import { Plus, Search, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { OrganizationCard } from '@/modules/organizations/components/org-card'
import { redirect } from 'next/navigation'
import { routes } from '@/lib/routes'

// Sample data
const organizations = [
  {
    id: "1",
    name: "Acme Corp",
    description: "Building the future of web applications with modern technologies and innovative solutions.",
    plan: "Enterprise" as const,
    members: 24,
    projects: 12,
    createdAt: "Jan 2024",
    avatar: "/placeholder.svg?height=40&width=40",
    isOwner: true,
  },
  {
    id: "2",
    name: "StartupXYZ",
    description: "A fast-growing startup focused on AI-powered solutions for small businesses.",
    plan: "Pro" as const,
    members: 8,
    projects: 5,
    createdAt: "Mar 2024",
    isOwner: false,
  },
  {
    id: "3",
    name: "Design Studio",
    description: "Creative agency specializing in brand identity and digital experiences.",
    plan: "Team" as const,
    members: 15,
    projects: 8,
    createdAt: "Feb 2024",
    isOwner: true,
  },
  {
    id: "4",
    name: "Tech Collective",
    description: "Open source community building tools for developers worldwide.",
    plan: "Free" as const,
    members: 3,
    projects: 2,
    createdAt: "Apr 2024",
    isOwner: false,
  },
  {
    id: "5",
    name: "E-commerce Plus",
    description: "Helping retailers build better online shopping experiences with cutting-edge technology.",
    plan: "Pro" as const,
    members: 12,
    projects: 7,
    createdAt: "Dec 2023",
    isOwner: false,
  },
  {
    id: "6",
    name: "Mobile First",
    description: "Mobile app development agency creating beautiful and performant applications.",
    plan: "Team" as const,
    members: 18,
    projects: 15,
    createdAt: "Nov 2023",
    isOwner: true,
  },
]

export default function OrganizationsPage() {
  return (
    <div className='flex justify-center'>
      <div className="min-h-screen bg-background">
        <main className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
              <p className="text-muted-foreground mt-2">
                Manage your organizations and collaborate with your team.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
                  className="pl-8 w-[300px]"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    redirect(routes.protected.dashboard.organizations.new)
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Organization
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create Organization</DialogTitle>
                    <DialogDescription>
                      Create a new organization to collaborate with your team.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Organization Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter organization name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your organization"
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="plan">Plan</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Organization</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((organization) => (
              <OrganizationCard key={organization.id} organization={organization} />
            ))}
          </div>

          {organizations.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto max-w-md">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No organizations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first organization to collaborate with your team.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Organization
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create Organization</DialogTitle>
                      <DialogDescription>
                        Create a new organization to collaborate with your team.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Organization Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter organization name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your organization"
                          rows={3}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="plan">Plan</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a plan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="pro">Pro</SelectItem>
                            <SelectItem value="team">Team</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Create Organization</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </main>
      </div>

    </div>
  )
}
