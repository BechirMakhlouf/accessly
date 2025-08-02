"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle, Clock } from "lucide-react"
import { SupabaseCSRClient } from "@/lib/supabase/client"

interface ConfirmEmailCardProps {
  email: string
  onChangeEmail?: () => void
  isConfirmed?: boolean // parent controls this via polling the user/email status
}

export function ConfirmEmailCard({
  email,
  isConfirmed = false,
}: ConfirmEmailCardProps) {
  const [isResending, setIsResending] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null)

  // Timer effect
  useEffect(() => {
    if (cooldownTime === 0) return
    const interval = setInterval(() => {
      setCooldownTime((sec) => (sec <= 1 ? 0 : sec - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [cooldownTime])

  const handleResendEmail = async () => {
    if (isResending || cooldownTime > 0) return

    setIsResending(true)
    setFeedback(null)
    setFeedbackType(null)

    try {
      const { error } = await SupabaseCSRClient.auth.resend({
        type: "signup",
        email,
      })
      if (error) {
        setFeedback(error.message || "Could not send confirmation email. Please try again.")
        setFeedbackType("error")
      } else {
        setFeedback("Verification email sent! Please check your inbox.")
        setFeedbackType("success")
        setCooldownTime(60)
      }
    } catch (err) {
      setFeedback(
        err instanceof Error
          ? err.message
          : "Could not send confirmation email. Please try again."
      )
      setFeedbackType("error")
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Render confirmed state
  if (isConfirmed) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">
            Email confirmed!
          </h2>
          <p className="text-muted-foreground">
            Your email has been successfully verified. You can now continue.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Render confirmation-in-progress UI
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-2xl font-semibold">Check your email</CardTitle>
        <CardDescription className="text-base">
          We sent a verification link to
          <br />
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Click the link in the email to verify your account. If you don&apos;t see it, check your spam folder.
        </p>

        {feedback && (
          <div
            className={`text-center text-sm min-h-5 transition ${feedbackType === "error" ? "text-destructive" : "text-primary"
              }`}
            aria-live="polite"
            role="status"
          >
            {feedback}
          </div>
        )}

        <Button
          onClick={handleResendEmail}
          disabled={cooldownTime > 0 || isResending}
          variant="outline"
          className="w-full"
        >
          {isResending ? (
            <>
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Sending...
            </>
          ) : cooldownTime > 0 ? (
            <>
              <Clock className="w-4 h-4 mr-2" />
              Resend in {formatTime(cooldownTime)}
            </>
          ) : (
            "Resend verification email"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
