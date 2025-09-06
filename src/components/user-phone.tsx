"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PhoneInput } from "@/components/phone-input"
import { toast } from "sonner"
import { updateUserPhone } from "@/lib/auth/actions"
import { Loader2, Phone } from "lucide-react"
import { useAuth } from "@/lib/auth/hooks/useAuth"
import { eventBus } from "@/event-bus"

export function UserPhone() {
  const { user, refetchUser } = useAuth()
  const [phone, setPhone] = useState<string>(user?.phone ?? "")
  const [isLoading, setIsLoading] = useState(false)

  // Sync local state when user.phone changes
  useEffect(() => {
    if (!user?.phone) return
    setPhone(prev => {
      const formatted = user.phone!.startsWith('+') ? user.phone! : `+${user.phone}`
      return prev === formatted ? prev : formatted
    })
  }, [user?.phone])

  const handleUpdate = async () => {
    if (!phone) return toast.error("Phone is empty")
    setIsLoading(true)
    try {
      type UpdateUserPhoneResult = Awaited<ReturnType<typeof updateUserPhone>>
      const res: UpdateUserPhoneResult = await updateUserPhone(phone)
      if (res?.error) {
        const message = res.error && typeof (res.error as { message: string }).message === 'string' ? (res.error as { message: string }).message : 'Failed to update phone number'
        toast.error(message)
      } else {
        toast.success("Phone number updated successfully!")
        // Emit a generic data-updated event (could be used by other parts of the app)
  eventBus.emit('data-updated', { dataId: 'user-phone', newData: phone })
  // Refetch auth user to update context
  refetchUser()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      toast.error(message || "Failed to update phone number")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone Number</label>
        <PhoneInput value={phone} onChange={(v) => setPhone(v as string)} />
      </div>
      <Button onClick={handleUpdate} disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Phone className="mr-2 h-4 w-4" />}
        {isLoading ? "Updating..." : "Update Phone"}
      </Button>
    </div>
  )
}

export default UserPhone