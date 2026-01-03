import { createJiti } from 'jiti';
import createNextIntlPlugin from 'next-intl/plugin';
import { withBotId } from 'botid/next/config';
import withBundleAnalyzer from '@next/bundle-analyzer';

const jiti = createJiti(import.meta.url);

const enableCacheComponents = process.env.NEXT_CACHE_COMPONENTS === 'true';

// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
await jiti.import('./src/lib/env');

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    '127.0.0.1:3000',
    'localhost:3000',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons/**',
      },
    ],
  },
  cacheComponents: enableCacheComponents,
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(
  withBotId(
    createNextIntlPlugin({
      requestConfig: './src/lib/i18n/request.ts',
      experimental: {},
    })(nextConfig)
  )
);
