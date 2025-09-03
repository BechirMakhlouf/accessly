"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PhoneInput } from "@/components/phone-input"
import { toast } from "sonner"
import { updateUserPhone } from "@/lib/auth/actions"
import { Loader2, Phone } from "lucide-react"
import { useAuth } from "@/lib/auth/hooks/useAuth"

export function UserPhone() {
  const { user } = useAuth()

  const [phone, setPhone] = useState<string>(user?.phone ?? "")
  const [isLoading, setIsLoading] = useState(false)

  // Keep local phone in sync with auth user when available.
  useEffect(() => {
    const phoneVal = user?.phone ?? ""
    if (phoneVal && phoneVal !== phone) {
      setPhone(phoneVal.startsWith("+") ? phoneVal : `+${phoneVal}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.phone])

  const handleUpdate = async () => {
    setIsLoading(true)
    try {
      type UpdateUserPhoneResult = Awaited<ReturnType<typeof updateUserPhone>>
      const res: UpdateUserPhoneResult = await updateUserPhone(phone)
      if (res?.error) {
        const message = res.error && typeof (res.error as { message: string }).message === 'string' ? (res.error as { message: string }).message : 'Failed to update phone number'
        toast.error(message)
      } else {
        toast("Phone number updated successfully!")
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
