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
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/hooks/useAuth' // <-- useAuth hook
import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { emitEvent } from '@/event-bus'

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export function SignInForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter()
  const t = useTranslations('auth')
  const auth = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOauthLoading, setIsOauthLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    clearErrors('root')
    setIsSubmitting(true)
    try {
      // useAuth.signInWithPassword returns Supabase response { data, error }.
      const res = await auth.signInWithPassword({ email: data.email, password: data.password })
      // handle Supabase error shape
      const error = res.error
      if (error) {
        setError('root', { type: 'server', message: error.message ?? String(error) })
        return
      }
      // success -> emit event and navigate to protected dashboard
  reset()
  emitEvent('user-logged-in', { userId: res.data?.user?.email ?? 'unknown' });
  router.push(routes.protected.dashboard.root)
    } catch (err: unknown) {
      console.error("error while signing in with oauth", err);
      setError('root', { type: 'server', message: "error while singing in." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'azure' | 'apple') => {
    clearErrors('root')
    setIsOauthLoading(true)
    try {
      const res = await auth.signInWithOAuth(provider)
      const error = res.error
      if (error) {
        setError('root', { type: 'server', message: error.message ?? String(error) })
        return
      }
      // With OAuth, Supabase usually redirects you to the provider.
      // In case your flow returns immediately and you want to navigate:
      router.push(routes.protected.dashboard.root)
    } catch (err: unknown) {
      console.error("error while signing in with oauth", err);
      setError('root', { type: 'server', message: "error while signing in." })
    } finally {
      setIsOauthLoading(false)
    }
  }

  const loading = isSubmitting || isOauthLoading
  const errorMessage = (errors.root?.message as string)

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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password')}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{t('errors.pwShort')}</p>
                )}
              </div>
              {errorMessage && (
                <p className="text-sm text-destructive" role="alert" aria-live="assertive">{errorMessage}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('signInForm.loggingIn')}
                  </>
                ) : (
                  t('signInForm.login')
                )}
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
