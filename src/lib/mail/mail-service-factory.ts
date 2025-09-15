import { EmailService } from "./email-service";
import { InbucketMailService } from "./inbucket-service";
import { mailClient } from "./client";
import { IMailService } from "./types";

/**
 * Factory function to create the appropriate mail service based on environment
 */
export function createMailService(): IMailService {
    // Use Inbucket in development, Resend in production
    if (process.env.NODE_ENV === "development") {
        return new InbucketMailService();
    }

    // In production, use Resend
    return new EmailService(mailClient);
}

/**
 * Create a mail service specifically for Inbucket (useful for testing)
 */
export function createInbucketMailService(): InbucketMailService {
    return new InbucketMailService();
}

/**
 * Create a mail service specifically for Resend (useful for production)
 */
export function createResendMailService(): EmailService {
    return new EmailService(mailClient);
}
