import { env } from "../env";
import { renderReactEmail } from "./react-email-utils";
import { EmailOptions, EmailResponse, IMailService } from "./types";

/**
 * Mailpit email service for local development
 * Routes all emails to the local Mailpit instance
 */
export class InbucketMailService implements IMailService {
    private readonly mailpitUrl: string;

    constructor(mailpitUrl: string = env.INBUCKET_URL) {
        this.mailpitUrl = mailpitUrl;
    }

    /**
     * Send an email to Mailpit for local development
     */
    async send(options: EmailOptions): Promise<EmailResponse> {
        try {
            // Convert React element to HTML if provided
            let htmlContent = options.html;
            if (options.react && !htmlContent) {
                htmlContent = await renderReactEmail(
                    options.react as React.ReactElement,
                );
            }

            // Ensure to is always an array
            const recipients = Array.isArray(options.to)
                ? options.to
                : [options.to];

            // Send to Mailpit
            await this.sendToMailpit({
                to: recipients,
                from: options.from || `noreply@${env.MAIL_FROM_DOMAIN}`,
                subject: options.subject,
                html: htmlContent,
                text: options.text,
            });

            return { data: { id: "mailpit-" + Date.now() }, error: null };
        } catch (error) {
            console.error("Failed to send email to Mailpit:", error);
            return {
                data: null,
                error: {
                    message: error instanceof Error
                        ? error.message
                        : "Unknown error",
                    code: "MAILPIT_ERROR",
                },
            };
        }
    }

    /**
     * Send a single email to Mailpit
     */
    private async sendToMailpit(email: {
        to: string[];
        from: string;
        subject: string;
        html?: string;
        text?: string;
    }): Promise<void> {
        try {
            const response = await fetch(
                `${this.mailpitUrl}/api/v1/send`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        To: email.to.map((addr) => ({ Name: "", Email: addr })),
                        From: { Name: "", Email: email.from },
                        Subject: email.subject,
                        Text: email.text || "",
                        HTML: email.html || "",
                    }),
                },
            );

            if (!response.ok) {
                throw new Error(
                    `Mailpit API error: ${response.status} ${response.statusText}`,
                );
            }
        } catch (error) {
            if (
                error instanceof TypeError &&
                error.message.includes("fetch failed")
            ) {
                throw new Error(
                    `Mailpit is not running. Please start Mailpit at ${this.mailpitUrl} or check your INBUCKET_URL environment variable.`,
                );
            }
            throw error;
        }
    }
}
