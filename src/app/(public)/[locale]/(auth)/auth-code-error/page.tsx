import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getLocale, getTranslations } from 'next-intl/server';
import { translateErrorCode } from 'supabase-error-translator-js';

export default async function Page({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const params = await searchParams;
  const t = await getTranslations('authCodeError');
  const locale = await getLocale();

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
                  {translateErrorCode(params.error, 'auth', locale)}
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
