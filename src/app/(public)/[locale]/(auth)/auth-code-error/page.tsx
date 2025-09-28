import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTranslations } from 'next-intl/server';

export default async function Page({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const params = await searchParams;
  const t = await getTranslations('authCodeError');
  const tErrors = await getTranslations('authErrors');

  const mapAuthErrorCode = (code: string | undefined | null) => {
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
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('title')}</CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="text-sm text-muted-foreground">
                  {t('codeErrorPrefix')}{' '}
                  {tErrors(mapAuthErrorCode(params.error))}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">{t('unspecifiedError')}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
