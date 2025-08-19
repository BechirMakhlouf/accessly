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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { GoogleIcon } from '@/components/icons/google'
import { MicrosoftIcon } from '@/components/icons/microsoft'
import { AppleIcon } from '@/components/icons/apple'
import { Separator } from '@/components/ui/separator'
import { routes } from '@/lib/routes'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { signInMutationOptions, signInWithOAuthMutationOptions } from '../queries'
import { SupabaseCSRClient } from '@/lib/supabase/client'
import { getQueryClient } from '@/lib/query-client'

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export function SignInForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('auth')
  const queryClient = getQueryClient()
  const supabase = SupabaseCSRClient // your client instance

  // TanStack Query Mutations
  const signInMutation = useMutation(
    signInMutationOptions(supabase, queryClient, locale)
  )
  const oauthMutation = useMutation(
    signInWithOAuthMutationOptions(supabase, queryClient, locale)
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  })

  // On submit: sign in with password
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      await signInMutation.mutateAsync({ email: data.email, password: data.password })
      router.push(routes.protected.dashboard.root)
      reset()
    } catch (err) {
      // setError("root", err)
    }
  }

  // On click: sign in with OAuth provider
  const handleOAuth = async (provider: 'google' | 'azure' | 'apple') => {
    try {
      await oauthMutation.mutateAsync(provider)
      router.push(routes.protected.dashboard.root)
      reset()
    } catch (err) {
      // setError("root", err)
    }
  }

  const loading = signInMutation.isPending || oauthMutation.isPending
  const errorMessage =
    (signInMutation.error as { message?: string })?.message ||
    (oauthMutation.error as { message?: string })?.message

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('signInForm.loginTitle')}</CardTitle>
          <CardDescription>{t('signInForm.loginDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-11"
              onClick={() => handleOAuth('google')}
              disabled={loading}
              type="button"
            >
              <span className="sr-only">{t('oauth.google')}</span>
              <GoogleIcon />
            </Button>
            <Button
              variant="outline"
              className="h-11"
              onClick={() => handleOAuth('azure')}
              disabled={loading}
              type="button"
            >
              <MicrosoftIcon />
              <span className="sr-only">{t('oauth.microsoft')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-11"
              onClick={() => handleOAuth('apple')}
              disabled={loading}
              type="button"
            >
              <AppleIcon />
              <span className="sr-only">{t('oauth.apple')}</span>
            </Button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{t('orContinueWith')}</span>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('emailLabel')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  autoComplete="email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{t('errors.invalidEmail')}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('passwordLabel')}</Label>
                  <Link
                    href={routes.auth.forgotPassword}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {t('signInForm.forgotPassword')}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{t('errors.pwShort')}</p>
                )}
              </div>
              {errorMessage && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('signInForm.loggingIn') : t('signInForm.login')}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t('signInForm.signupPrompt')}{' '}
              <Link href={routes.auth.signUp} className="underline underline-offset-4">
                {t('signInForm.signup')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
