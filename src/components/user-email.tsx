"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { updateUserEmail } from "@/lib/auth/actions"
import { Loader2, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth/hooks/useAuth";
import { eventBus } from "@/event-bus";

export function UserEmail() {
  const { user, refetchUser } = useAuth();
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [isLoading, setIsLoading] = useState(false);

  // Sync when user.email changes
  useEffect(() => {
    if (user?.email && user.email !== email) setEmail(user.email);
  }, [user?.email]);

  const handleUpdate = async () => {
    if (!email) return toast.error("Email is empty");
    setIsLoading(true);
    try {
      type UpdateUserEmailResult = Awaited<ReturnType<typeof updateUserEmail>>;
      const res: UpdateUserEmailResult = await updateUserEmail(email);
      if (res?.error) {
        const message = res.error && typeof (res.error as { message: string }).message === 'string' ? (res.error as { message: string }).message : 'Failed to update email';
        toast.error(message);
      } else {
        toast.success("Email updated successfully!");
        eventBus.emit('data-updated', { dataId: 'user-email', newData: email });
        await refetchUser();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Failed to update email");
    } finally {
      setIsLoading(false);
    }
  };

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
  );
}

export default UserEmail;