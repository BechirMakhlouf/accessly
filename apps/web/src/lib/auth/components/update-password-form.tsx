'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SupabaseCSRClient } from '@/lib/supabase/client';
import { routes } from '@/lib/routes';
import { useTranslations } from 'next-intl';

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const t = useTranslations('updatePasswordForm');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError(t('passwordTooShort'));
      setIsLoading(false);
      return;
    }

    try {
      const supabase = SupabaseCSRClient;
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      // Redirect to dashboard after successful password update
      router.push(routes.protected.dashboard.root);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>{t('resetYourPassword')}</CardTitle>
          <CardDescription>{t('enterNewPassword')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='password'>{t('newPassword')}</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder={t('newPasswordPlaceholder')}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  minLength={6}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='confirmPassword'>{t('confirmPassword')}</Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  placeholder={t('confirmPasswordPlaceholder')}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  minLength={6}
                />
              </div>
              {error && <p className='text-sm text-destructive'>{error}</p>}
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? t('saving') : t('saveNewPassword')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
