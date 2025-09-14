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
    "127.0.0.1:3000",
    "localhost:3000",
  ],
  experimental: {
  },
};

export default withBotId(
  createNextIntlPlugin({
    experimental: {
      createMessagesDeclaration: "./src/lib/i18n/request.ts"
    }
  })(nextConfig),
);
