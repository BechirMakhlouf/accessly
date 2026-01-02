export interface EmailService {
  sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }): Promise<{ success: boolean; error?: string }>;
}
