import { Resend } from "resend";
import { env } from "../env";

/**
 * Shared Resend client instance. Server-only.
 */
export const mailClient = new Resend(env.RESEND_API_KEY);