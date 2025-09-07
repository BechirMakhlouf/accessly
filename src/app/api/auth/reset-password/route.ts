import { getFullRoute } from '@/lib/routes'
import { createSSRClient } from '@/lib/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (token_hash && type === 'recovery') {
    const supabase = await createSSRClient()

    const { data, error } = await supabase.auth.verifyOtp({
      type: 'recovery',
      token_hash,
    })
    
    if (!error && data.session) {
      // User is now authenticated and can access the protected update-password page
      redirect(getFullRoute('/update-password'))
    } else {
      // redirect the user to an error page with some instructions
      redirect(getFullRoute(`/auth-code-error`, { error: error?.code || 'verification_failed' }))
    }
  }

  // redirect the user to an error page with some instructions
  redirect(getFullRoute("/auth-code-error"))
}
