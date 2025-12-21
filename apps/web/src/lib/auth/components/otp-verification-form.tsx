'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, CheckCircle, AlertCircle } from 'lucide-react';
import { verifyOtp } from '../actions';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface OtpVerificationFormProps {
  email: string;
  type: 'email' | 'recovery' | 'magiclink' | 'email_change';
  onSuccess?: () => void;
  onError?: (error: string) => void;
  successRedirectUrl?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
}

export function OtpVerificationForm({
  email,
  type,
  onSuccess,
  onError,
  successRedirectUrl,
  title = 'Enter Verification Code',
  description = 'Please enter the 6-digit verification code sent to your email.',
  buttonText = 'Verify Code',
  className = '',
}: OtpVerificationFormProps) {
  const t = useTranslations('otpVerificationForm');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(
    null
  );
  const router = useRouter();

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || isVerifying) return;

    setIsVerifying(true);
    setFeedback(null);
    setFeedbackType(null);

    try {
      const { data, error } = await verifyOtp(email, otp.trim(), type);

      if (error) {
        const errorMessage = error.message || t('invalidCode');
        setFeedback(errorMessage);
        setFeedbackType('error');
        onError?.(errorMessage);
      } else if (data.session) {
        const successMessage = t('verificationSuccess');
        setFeedback(successMessage);
        setFeedbackType('success');
        onSuccess?.();

        // Redirect if URL provided
        if (successRedirectUrl) {
          setTimeout(() => {
            router.push(successRedirectUrl);
          }, 1500);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t('verificationError');
      setFeedback(errorMessage);
      setFeedbackType('error');
      onError?.(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setOtp(numericValue);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className='text-center space-y-2'>
        <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto'>
          <Key className='w-6 h-6 text-blue-600 dark:text-blue-400' />
        </div>
        <h3 className='text-lg font-semibold'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{description}</p>
        <p className='text-sm font-medium text-foreground'>{email}</p>
      </div>

      <form onSubmit={handleVerifyOtp} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='otp'>{t('verificationCode')}</Label>
          <Input
            id='otp'
            type='text'
            placeholder={t('enterCode')}
            value={otp}
            onChange={e => handleOtpChange(e.target.value)}
            maxLength={6}
            className='text-center text-lg tracking-widest'
            autoComplete='one-time-code'
            autoFocus
          />
        </div>

        {feedback && (
          <div
            className={`flex items-center gap-2 text-sm p-3 rounded-md ${
              feedbackType === 'error'
                ? 'bg-destructive/10 text-destructive border border-destructive/20'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
            role='alert'
          >
            {feedbackType === 'error' ? (
              <AlertCircle className='w-4 h-4 flex-shrink-0' />
            ) : (
              <CheckCircle className='w-4 h-4 flex-shrink-0' />
            )}
            <span>{feedback}</span>
          </div>
        )}

        <Button
          type='submit'
          disabled={otp.length !== 6 || isVerifying}
          className='w-full'
        >
          {isVerifying ? (
            <>
              <span className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2' />
              {t('verifying')}
            </>
          ) : (
            buttonText
          )}
        </Button>
      </form>
    </div>
  );
}
