import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_SITE_URL: z.url(),
    NEXT_PUBLIC_SERVICE_URL: z.url(),
  },

  server: {
    SUPABASE_SECRET_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    MAIL_FROM_DOMAIN: z.string().min(1),
    INBUCKET_URL: z.url().default('http://localhost:54324'),
    DATABASE_URL: z.url(),
  },

  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SERVICE_URL: process.env.NEXT_PUBLIC_SERVICE_URL,
  },
});
