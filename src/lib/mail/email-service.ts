import { env } from "../env";
import type { CreateEmailOptions, CreateEmailResponse, Resend } from "resend";

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

type EmailOptions = Omit<CreateEmailOptions, "from"> & { from?: string };

/**
 * Generic email service that can send any type of email
 */
export class EmailService {
  private readonly mailClient: Resend;

  constructor(mailClient: Resend) {
    this.mailClient = mailClient;
  }

  /**
   * Send an email with the provided options
   */
  async send(options: EmailOptions): Promise<CreateEmailResponse> {
    // Route emails to test address in development
    const to = routeEmailForDevelopment(options.to);
    const from = options.from || getDefaultFromEmail();

    // Send the email
    const result: CreateEmailResponse = await this.mailClient.emails.send({
      ...options,
      to,
      from,
    } as CreateEmailOptions);

    if (result.error) {
      console.error("Failed to send email:", result.error);
    }

    return result;
  }
}
