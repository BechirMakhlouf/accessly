import { CreateEmailOptions } from 'resend';

/**
 * Mail service interface that both services implement
 */
export interface IMailService {
  send(options: {
    to: string | string[];
    from?: string;
    subject: string;
    html?: string;
    text?: string;
    react?: React.ReactElement;
  }): Promise<EmailResponse>;
}

export type EmailOptions = Omit<CreateEmailOptions, 'from'> & { from?: string };
export type EmailResponse =
  | { data: { id: string }; error: null }
  | {
      data: null;
      error: { message?: string; code?: string };
    };
