"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { updateUserEmail, getUserEmail } from "@/lib/auth/actions"
import { Loader2, Mail } from "lucide-react"

export function UserEmail() {
  const [email, setEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        type GetUserEmailResult = Awaited<ReturnType<typeof getUserEmail>>
        const res: GetUserEmailResult = await getUserEmail()
        if (!mounted) return
        if (res?.error) return
        const emailVal = res?.data ?? null
        if (emailVal && typeof emailVal === "string") setEmail(emailVal)
      } catch (e) {
    console.error(e)
        // ignore
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const handleUpdate = async () => {
    setIsLoading(true)
    try {
      type UpdateUserEmailResult = Awaited<ReturnType<typeof updateUserEmail>>
      const res: UpdateUserEmailResult = await updateUserEmail(email)
      if (res?.error) {
        const message = res.error && typeof (res.error as { message: string }).message === 'string' ? (res.error as { message: string }).message : 'Failed to update email'
        toast.error(message)
      } else {
        toast("Email updated successfully!")
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      toast.error(message || "Failed to update email")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input id="user-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <Button onClick={handleUpdate} disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
        {isLoading ? "Updating..." : "Update Email"}
      </Button>
    </div>
  )
}

export default UserEmail
