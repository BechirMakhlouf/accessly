import { fileURLToPath } from "node:url";
import createJiti from "jiti";
import createNextIntlPlugin from "next-intl/plugin";
import { withBotId } from "botid/next/config";

const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
jiti("./src/lib/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
  ],
  experimental: {},
};

// Injected content via Sentry wizard below
import { withSentryConfig } from "@sentry/nextjs";

const config = withBotId(
  createNextIntlPlugin("./src/lib/i18n/request.ts")(nextConfig),
);

export default withSentryConfig(
  config,
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "accessly",
    project: "accessly-web",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
