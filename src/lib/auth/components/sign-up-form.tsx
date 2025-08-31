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
import { useRouter } from '@/lib/i18n/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { AppleIcon } from '@/components/icons/apple'
import { GoogleIcon } from '@/components/icons/google'
import { MicrosoftIcon } from '@/components/icons/microsoft'
import { routes } from '@/lib/routes'
import { useLocale, useTranslations } from 'next-intl'
import { useMutation } from '@tanstack/react-query'
import { signUpMutationOptions, signInWithOAuthMutationOptions } from '../queries'
import { SupabaseCSRClient } from '@/lib/supabase/client'
import { getQueryClient } from '@/lib/query-client'
import { AuthError } from '@supabase/supabase-js'
import { useState } from 'react'

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  repeatPassword: z.string(),
}).refine((data) => data.password === data.repeatPassword, {
  path: ["repeatPassword"]
});

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("auth");
  const queryClient = getQueryClient();
  const supabase = SupabaseCSRClient;

  // --- Mutations
  const signUpMutation = useMutation(
    signUpMutationOptions(supabase, queryClient, locale)
  );
  const oauthMutation = useMutation(
    signInWithOAuthMutationOptions(supabase, queryClient, locale)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  // --- Form submit for email/pass
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    const { email, password } = data;
    try {
      const user = await signUpMutation.mutateAsync({ email, password });
      if (user) {
        router.push({ pathname: routes.auth.signUpSuccess, query: { email: user.email } });
      }
      reset();
    } catch (err) {
      // error shown below
      console.error(err)
    }
  };

  // --- OAuth handler
  const handleOAuth = async (provider: "google" | "azure" | "apple") => {
    try {
      await oauthMutation.mutateAsync(provider);
      router.push(routes.auth.signUpSuccess);
      reset();
    } catch (err) {
      // error shown below
      console.error(err)
    }
  };

  const [showPassword, setShowPassword] = useState(false)
  const loading = signUpMutation.isPending || oauthMutation.isPending;
  const errorMessage =
    (signUpMutation.error as AuthError)?.message ??
    (oauthMutation.error as AuthError)?.message;

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className="text-3xl">{t('signUpForm.signUpTitle')}</CardTitle>
          <CardDescription>{t('signUpForm.signUpDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="h-11" onClick={() => handleOAuth("google")} type="button" disabled={loading}>
              <GoogleIcon />
              <span className="sr-only">{t('oauth.google')}</span>
            </Button>
            <Button variant="outline" className="h-11" onClick={() => handleOAuth("azure")} type="button" disabled={loading}>
              <MicrosoftIcon />
              <span className="sr-only">{t('oauth.microsoft')}</span>
            </Button>
            <Button variant="outline" className="h-11" onClick={() => handleOAuth("apple")} type="button" disabled={loading}>
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
                  {...register('email')}
                  autoComplete="email"
                />
                {errors.email && <p className="text-sm text-destructive">{t("errors.invalidEmail")}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t('passwordLabel')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    autoComplete="new-password"
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
                {errors.password && <p className="text-sm text-destructive">{t("errors.pwShort")}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password">{t('signUpForm.repeatPasswordLabel')}</Label>
                <Input
                  id="repeat-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('repeatPassword')}
                  autoComplete="new-password"
                />
                {errors.repeatPassword && <p className="text-sm text-destructive">{t("signUpForm.errors.passwordsMismatch")}</p>}
              </div>
              {errorMessage && <p className="text-sm text-destructive" role="alert" aria-live="assertive">{errorMessage}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('signUpForm.creatingAccount')}
                  </>
                ) : (
                  t('signUpForm.signUp')
                )}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t('signUpForm.alreadyHaveAccount')} {' '}
              <Link href={routes.auth.signIn} className="underline underline-offset-4">
                {t('signUpForm.signIn')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
