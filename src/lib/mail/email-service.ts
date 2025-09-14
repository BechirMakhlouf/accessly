import { mailClient } from "./client";
import { env } from "../env";
import { render } from "@react-email/render";
import { ReactElement } from "react";
import type { CreateEmailOptions } from "resend";

/**
 * Email sending options for the generic email service
 */
export interface EmailOptions {
    /** Recipient email address(es) */
    to: string | string[];
    /** Email subject */
    subject: string;
    /** Plain text content */
    text?: string;
    /** HTML content */
    html?: string;
    /** React component to render as email content */
    react?: ReactElement;
    /** Reply-to email address */
    replyTo?: string;
    /** CC recipients */
    cc?: string | string[];
    /** BCC recipients */
    bcc?: string | string[];
    /** Custom headers */
    headers?: Record<string, string>;
    /** Attachments */
    attachments?: Array<{
        content: Buffer | string;
        filename: string;
        path?: string;
    }>;
    /** Custom from email (overrides default) */
    from?: string;
    /** Tags for email categorization */
    tags?: Array<{
        name: string;
        value: string;
    }>;
}

/**
 * Email sending result
 */
export interface EmailResult {
    success: boolean;
    data?: {
        id: string;
    };
    error?: string;
}

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
export class EmailService {
    /**
     * Send an email with the provided options
     */
    static async send(options: EmailOptions): Promise<EmailResult> {
        try {
            // Route emails to test address in development
            const to = routeEmailForDevelopment(options.to);

            // Handle different content types and build email data
            let emailData: CreateEmailOptions;

            if (options.react) {
                // Render React component to HTML and text
                const html = await render(options.react);
                const text = await render(options.react, { plainText: true });

                emailData = {
                    from: options.from || getDefaultFromEmail(),
                    to,
                    subject: options.subject,
                    replyTo: options.replyTo,
                    cc: options.cc,
                    bcc: options.bcc,
                    html,
                    text,
                    headers: {
                        "X-Entity-Ref-ID": `email-${Date.now()}-${
                            Math.random().toString(36).substr(2, 9)
                        }`,
                        ...options.headers,
                    },
                    tags: options.tags,
                    attachments: options.attachments,
                };
            } else if (options.html) {
                emailData = {
                    from: options.from || getDefaultFromEmail(),
                    to,
                    subject: options.subject,
                    replyTo: options.replyTo,
                    cc: options.cc,
                    bcc: options.bcc,
                    html: options.html,
                    text: options.text,
                    headers: {
                        "X-Entity-Ref-ID": `email-${Date.now()}-${
                            Math.random().toString(36).substr(2, 9)
                        }`,
                        ...options.headers,
                    },
                    tags: options.tags,
                    attachments: options.attachments,
                };
            } else if (options.text) {
                emailData = {
                    from: options.from || getDefaultFromEmail(),
                    to,
                    subject: options.subject,
                    replyTo: options.replyTo,
                    cc: options.cc,
                    bcc: options.bcc,
                    text: options.text,
                    headers: {
                        "X-Entity-Ref-ID": `email-${Date.now()}-${
                            Math.random().toString(36).substr(2, 9)
                        }`,
                        ...options.headers,
                    },
                    tags: options.tags,
                    attachments: options.attachments,
                };
            } else {
                throw new Error(
                    "Email must have either react, html, or text content",
                );
            }

            // Send the email
            const data = await mailClient.emails.send(emailData);

            return {
                success: true,
                data: {
                    id: data.data?.id || "unknown",
                },
            };
        } catch (error) {
            console.error("Failed to send email:", error);
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
            };
        }
    }

    /**
     * Send a simple text email
     */
    static async sendText(
        options: Omit<EmailOptions, "html" | "react">,
    ): Promise<EmailResult> {
        return this.send(options);
    }

    /**
     * Send an HTML email
     */
    static async sendHtml(
        options: Omit<EmailOptions, "react">,
    ): Promise<EmailResult> {
        return this.send(options);
    }

    /**
     * Send a React email
     */
    static async sendReact(
        options: Omit<EmailOptions, "html" | "text">,
    ): Promise<EmailResult> {
        return this.send(options);
    }

    /**
     * Send a test email to verify configuration
     */
    static async sendTestEmail(): Promise<EmailResult> {
        return this.send({
            to: DEV_EMAIL,
            subject: "Test Email from Accessly",
            text:
                "This is a test email to verify the email service configuration.",
            html:
                "<p>This is a test email to verify the email service configuration.</p>",
        });
    }
}

/**
 * Convenience function for sending emails
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
    return EmailService.send(options);
}

/**
 * Convenience function for sending text emails
 */
export async function sendTextEmail(
    options: Omit<EmailOptions, "html" | "react">,
): Promise<EmailResult> {
    return EmailService.sendText(options);
}

/**
 * Convenience function for sending HTML emails
 */
export async function sendHtmlEmail(
    options: Omit<EmailOptions, "react">,
): Promise<EmailResult> {
    return EmailService.sendHtml(options);
}

/**
 * Convenience function for sending React emails
 */
export async function sendReactEmail(
    options: Omit<EmailOptions, "html" | "text">,
): Promise<EmailResult> {
    return EmailService.sendReact(options);
}
