"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { useRouter } from '@/lib/i18n'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { OAuthButtons } from './oauth-buttons'
import { routes } from '@/lib/routes'
import { useTranslations } from 'next-intl'
import { AuthError } from '@supabase/supabase-js'
import { useState } from 'react'
import { useAuth } from '../hooks'

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  repeatPassword: z.string(),
}).refine((data) => data.password === data.repeatPassword, {
  path: ["repeatPassword"],
});

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter()
  const t = useTranslations("auth");
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  // --- Form submit for email/pass
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    const { email, password } = data;
    try {
      const user = await auth.signUp({ email, password });
      if (user) {
        router.push({ pathname: routes.auth.confirmEmail, query: { email: user.email } });
      }
      reset();
    } catch (err) {
      // error shown below
      console.error(err)
    }
  };


  const [showPassword, setShowPassword] = useState(false)
  const loading = auth.isSigningUp;
  const tAuthErrors = useTranslations('authErrors');
  const mapAuthErrorCode = (code?: string | null) => {
    switch (code) {
      case 'invalid_credentials':
      case 'user_already_exists':
      case 'user_not_found':
      case 'email_not_confirmed':
      case 'rate_limit_exceeded':
      case 'otp_expired':
      case 'provider_token_error':
        return code;
      default:
        return 'unknown_error';
    }
  };
  const errorCode = (auth.error as AuthError | null)?.code;
  const errorMessage = errorCode ? tAuthErrors(mapAuthErrorCode(errorCode)) : undefined;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">
            {t("signUpForm.signUpTitle")}
          </CardTitle>
          <CardDescription>{t("signUpForm.signUpDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthButtons loading={loading} />

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("emailLabel")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  {...register("email")}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {t("errors.invalidEmail")}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t("passwordLabel")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    aria-label={showPassword
                      ? t("hidePassword")
                      : t("showPassword")}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-muted-foreground"
                  >
                    {showPassword
                      ? <EyeOff className="h-4 w-4" />
                      : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {t("errors.pwShort")}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password">
                  {t("signUpForm.repeatPasswordLabel")}
                </Label>
                <Input
                  id="repeat-password"
                  type={showPassword ? "text" : "password"}
                  {...register("repeatPassword")}
                  autoComplete="new-password"
                />
                {errors.repeatPassword && (
                  <p className="text-sm text-destructive">
                    {t("signUpForm.errors.passwordsMismatch")}
                  </p>
                )}
              </div>
              {errorMessage && (
                <p
                  className="text-sm text-destructive"
                  role="alert"
                  aria-live="assertive"
                >
                  {errorMessage}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("signUpForm.creatingAccount")}
                    </>
                  )
                  : (
                    t("signUpForm.signUp")
                  )}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("signUpForm.alreadyHaveAccount")}{"  "}
              <Link
                href={routes.auth.signIn}
                className="underline underline-offset-4"
              >
                {t("signUpForm.signIn")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
