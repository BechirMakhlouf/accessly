"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createOrgWithoutSlug } from "@/modules/organizations/actions"
import { isNullOrUndefined } from "@/lib/utils"
import { toast } from "sonner"
import { routes } from "@/lib/routes"

export default function NewOrganizationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createOrgWithoutSlug({
        name: formData.name,
        description: formData.description || null,
      })
      
      if (isNullOrUndefined(result) || result.error) {
        console.error("error while creating an organization: ", result);
        toast.error("Error while creating an organization, try again later..")
        return
      }

      toast.success("Organization created successfully!")
      if (isNullOrUndefined(result.data?.slug)) {
        toast.error("Error while creating an organization, try again later..")
        return
      }
      router.push(routes.protected.dashboard.org.slug.root(result.data.slug))
    } catch (error) {
      console.error("Error creating organization:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(routes.protected.dashboard.organizations.root)
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
                This is your organization within Accessly.
              </p>
              <p className="text-muted-foreground">
                For example, you can use the name of your company or department.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-medium">
                  Organization Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter organization name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-sm text-muted-foreground">
                  What&apos;s the name of your company or team?
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your organization (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  disabled={isSubmitting}
                />
                <p className="text-sm text-muted-foreground">
                  A brief description of what your organization does.
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="px-6"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    You can edit your organization details later
                  </p>
                  <Button
                    variant="default"
                    type="submit"
                    className="px-6"
                    disabled={isSubmitting || !formData.name.trim()}
                  >
                    {isSubmitting ? "Creating..." : "Create organization"}
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
