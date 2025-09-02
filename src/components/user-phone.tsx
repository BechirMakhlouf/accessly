"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PhoneInput } from "@/components/phone-input"
import { toast } from "sonner"
import { updateUserPhone, getUserPhone } from "@/lib/auth/actions"
import { Loader2, Phone } from "lucide-react"

export function UserPhone() {
  const [phone, setPhone] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        type GetUserPhoneResult = Awaited<ReturnType<typeof getUserPhone>>
        const res: GetUserPhoneResult = await getUserPhone()
        if (!mounted) return
        if (res?.error) return
        const phoneVal = res?.data ?? null
        if (phoneVal && typeof phoneVal === "string") {
          setPhone(phoneVal.startsWith("+") ? phoneVal : `+${phoneVal}`)
        }
      } catch (e) {
        console.error(e)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

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
