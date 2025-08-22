"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ExternalLink } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createOrg } from "@/modules/organizations/actions"
import { useAuth } from "@/lib/auth/hooks/useAuth"

export default function NewOrganizationPage() {
  const router = useRouter()
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    type: "personal",
    plan: "free"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically submit the form data
    if (!user) return;

    const { error } = await createOrg({
      name: formData.name,
      description: formData.name,
      slug: formData.name,
      created_by: user.id
    })
    console.log(error);
    // router.push(routes.protected.dashboard.org.slug.root())
  }

  const handleCancel = () => {
    router.push("/")
  }

  return (
    <div className="bg-background flex justify-center">
      <main className="container py-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Create a new organization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <p className="text-foreground">
                This is your organization within Supabase.
              </p>
              <p className="text-muted-foreground">
                For example, you can use the name of your company or department.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Organization name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  What&apos;s the name of your company or team?
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="type" className="text-base font-medium">
                  Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="non-profit">Non-profit</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  What would best describe your organization?
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="plan" className="text-base font-medium">
                    Plan
                  </Label>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <Select
                  value={formData.plan}
                  onValueChange={(value) => setFormData({ ...formData, plan: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free - $0/month</SelectItem>
                    <SelectItem value="pro">Pro - $25/month</SelectItem>
                    <SelectItem value="team">Team - $125/month</SelectItem>
                    <SelectItem value="enterprise">Enterprise - Contact us</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  The Plan applies to your new organization.
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="px-6"
                >
                  Cancel
                </Button>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    You can rename your organization later
                  </p>
                  <Button
                    variant={"default"}
                    type="submit"
                    className="px-6 "
                  >
                    Create organization
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
