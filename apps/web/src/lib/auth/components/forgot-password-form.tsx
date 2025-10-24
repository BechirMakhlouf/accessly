'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'
import { routes } from '@/lib/routes'
import { useTranslations } from 'next-intl'
import { resetPassword } from '../actions'
import { OtpVerificationForm } from './otp-verification-form'

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const t = useTranslations('forgotPasswordForm')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOtpForm, setShowOtpForm] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await resetPassword(email)
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('genericError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t('checkYourEmail')}</CardTitle>
            <CardDescription>{t('passwordResetInstructionsSent')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('ifRegisteredUsingEmail')}
            </p>
            
            {!showOtpForm ? (
              <Button
                onClick={() => setShowOtpForm(true)}
                variant="outline"
                className="w-full"
              >
                {t('enterVerificationCodeInstead')}
              </Button>
            ) : (
              <OtpVerificationForm
                email={email}
                type="recovery"
                successRedirectUrl={routes.auth.updatePassword}
                title="Reset Your Password"
                description="Enter the verification code from your email to reset your password."
                buttonText="Verify and Reset Password"
              />
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t('resetYourPassword')}</CardTitle>
            <CardDescription>{t('enterEmailToReset')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('emailLabel')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('sending') : t('sendResetEmail')}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {t('alreadyHaveAccount')}{' '}
                <Link href={routes.auth.signIn} className="underline underline-offset-4">
                  {t('login')}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
