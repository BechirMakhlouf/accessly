import { env } from "../env";
import type { CreateEmailOptions, CreateEmailResponse, Resend } from "resend";
import type { IMailService } from "./types";
import { EmailOptions, EmailResponse } from "./types";

/**
 * Development environment email routing
 */
const DEV_EMAIL = "delivered@resend.dev";

/**
 * Get the default from email address using the configured domain
 */
function getDefaultFromEmail(): string {
  return `noreply@${env.MAIL_FROM_DOMAIN}`;
}

/**
 * Route emails to test addresses in development
 */
function routeEmailForDevelopment(email: string | string[]): string | string[] {
  if (process.env.NODE_ENV === "development") {
    if (Array.isArray(email)) {
      return email.map(() => DEV_EMAIL);
    }
    return DEV_EMAIL;
  }
  return email;
}

/**
 * Generic email service that can send any type of email
 */
export class EmailService implements IMailService {
  private readonly mailClient: Resend;

  constructor(mailClient: Resend) {
    this.mailClient = mailClient;
  }

  /**
   * Send an email with the provided options
   */
  async send(options: EmailOptions): Promise<EmailResponse> {
    // Route emails to test address in development
    const to = routeEmailForDevelopment(options.to);
    const from = options.from || getDefaultFromEmail();

    try {
      // Send the email
      const result: CreateEmailResponse = await this.mailClient.emails.send({
        ...options,
        to,
        from,
      } as CreateEmailOptions);

      if (result.error) {
        console.error("Failed to send email:", result.error);
        return {
          data: null,
          error: {
            message: result.error.message || "Unknown error",
            code: "RESEND_ERROR",
          },
        };
      }
      return { data: { id: result.data.id }, error: null };
    } catch (error) {
      console.error("Failed to send email:", error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          code: "RESEND_ERROR",
        },
      };
    }
  }
}
