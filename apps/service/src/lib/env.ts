import { config } from "dotenv";
import { z } from "zod";

console.debug("current environement: ", process.env.NODE_ENV);
if (process.env.NODE_ENV !== "production") {
  config({
    path: ".env.local",
    debug: true,
  });
}

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3030),
  SUPABASE_URL: z.url({ message: "SUPABASE_URL must be a valid URL" }),
  SUPABASE_SECRET_KEY: z.string().min(1, "SUPABASE_SECRET_KEY is required"),
  NODE_ENV: z.enum(["production", "development"]).default("development"),
  SLACK_BOT_TOKEN: z.string().min(1),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("🚨 Environment validation failed:");
  // Print readable validation errors (does NOT print secret values)
  console.error(JSON.stringify(z.treeifyError(parsed.error), null, 2));
  // Throw to fail import/build/CI
  throw new Error("Invalid environment variables");
}

// typed and validated env object
export const env = parsed.data;

export type Env = z.infer<typeof EnvSchema>;
