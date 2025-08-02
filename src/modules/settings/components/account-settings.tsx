"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Mail, Phone, Key, AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { PhoneInput } from "@/components/phone-input"
import { PasswordConfirmationDialog } from "./password-confirmation-dialog"

type PendingAction = "email" | "phone" | "password" | "delete" | null

export function AccountSettings() {
  const [email, setEmail] = useState("john.doe@example.com")
  const [phone, setPhone] = useState<string>("")
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePasswordReset = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    toast("Password reset email sent successfully!")
  }

  const handleEmailUpdate = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast("Email address updated successfully!")
  }

  const handlePhoneUpdate = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast("Phone number updated successfully!")
  }
  const handleAccountDelete = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast("Account deletion initiated. Please check your email for confirmation.")
  }

  const getDialogProps = (action: PendingAction) => {
    switch (action) {
      case "email":
        return {
          title: "Update Email Address",
          description: "Please enter your current password to update your email address.",
          onConfirm: handleEmailUpdate,
        }
      case "phone":
        return {
          title: "Update Phone Number",
          description: "Please enter your current password to update your phone number.",
          onConfirm: handlePhoneUpdate,
        }
      case "password":
        return {
          title: "Reset Password",
          description: "Please enter your current password to send a password reset email.",
          onConfirm: handlePasswordReset,
        }
      case "delete":
        return {
          title: "Delete Account",
          description: "Please enter your current password to confirm account deletion. This action cannot be undone.",
          onConfirm: handleAccountDelete,
        }
      default:
        return {
          title: "Confirm Operation",
          description: "Please enter your current password to confirm your operation.",
          onConfirm: () => { },
        }
    }
  }
  const dialogProps = getDialogProps(pendingAction)
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Address</CardTitle>
          <CardDescription>Update your email address for account notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button onClick={() => setPendingAction("email")}>
            <Mail className="mr-2 h-4 w-4" />
            Update Email
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phone Number</CardTitle>
          <CardDescription>Add or update your phone number for security purposes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <PhoneInput value={phone} onChange={(newPhone) => setPhone(newPhone)} />
          </div>
          <Button onClick={() => setPendingAction("phone")}>
            <Phone className="mr-2 h-4 w-4" />
            Update Phone
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Reset your password by sending a reset link to your email.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setPendingAction("password")} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}
            {isLoading ? "Sending..." : "Send Reset Email"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Permanently delete your account and all associated data.</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => setPendingAction("delete")}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
      <PasswordConfirmationDialog
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title={dialogProps.title}
        description={dialogProps.description}
        onConfirm={dialogProps.onConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}
