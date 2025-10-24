"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Check, Crown } from "lucide-react"

export function BillingSettings() {
  const [currentPlan, setCurrentPlan] = useState("free")

  const handlePlanChange = (plan: string) => {
    setCurrentPlan(plan)
    toast(`Successfully ${plan === "free" ? "downgraded to" : "upgraded to"} ${plan} plan!`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are currently on the {currentPlan} plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={currentPlan === "pro" ? "default" : "secondary"}>
              {currentPlan === "pro" && <Crown className="mr-1 h-3 w-3" />}
              {currentPlan.toUpperCase()}
            </Badge>
            {currentPlan === "pro" && <span className="text-sm text-muted-foreground">$9.99/month</span>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Choose the plan that best fits your needs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className={currentPlan === "free" ? "ring-2 ring-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Free
                  {currentPlan === "free" && <Check className="h-4 w-4 text-primary" />}
                </CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$0</div>
                <div className="text-sm text-muted-foreground">per month</div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>• Basic features</li>
                  <li>• 5 projects</li>
                  <li>• Community support</li>
                </ul>
                {currentPlan !== "free" && (
                  <Button
                    className="mt-4 w-full bg-transparent"
                    variant="outline"
                    onClick={() => handlePlanChange("free")}
                  >
                    Downgrade to Free
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className={currentPlan === "pro" ? "ring-2 ring-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Pro
                  {currentPlan === "pro" && <Check className="h-4 w-4 text-primary" />}
                </CardTitle>
                <CardDescription>For power users and teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$9.99</div>
                <div className="text-sm text-muted-foreground">per month</div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>• All features</li>
                  <li>• Unlimited projects</li>
                  <li>• Priority support</li>
                  <li>• Advanced analytics</li>
                </ul>
                {currentPlan !== "pro" && (
                  <Button className="mt-4 w-full" onClick={() => handlePlanChange("pro")}>
                    Upgrade to Pro
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {currentPlan === "pro" && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Cancel Subscription</CardTitle>
            <CardDescription>
              Cancel your Pro subscription. You&apos;ll continue to have access until the end of your billing period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Cancel Subscription</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel your Pro subscription? You&apos;ll lose access to Pro features at the end
                    of your billing period.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handlePlanChange("free")}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Cancel Subscription
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
