import { EmailService } from '@/lib/mail';
import { InviteMemberEmail } from './invite-member-email';

export interface SendInviteEmailParams {
  emailService: EmailService;
  inviterName: string;
  organizationName: string;
  inviteUrl: string;
  recipientEmail: string;
  role: string;
  fromEmail?: string;
}

export async function sendInviteMemberEmail({
  emailService,
  inviterName,
  organizationName,
  inviteUrl,
  recipientEmail,
  role,
  fromEmail,
}: SendInviteEmailParams) {
  return emailService.send({
    to: recipientEmail,
    subject: `You're invited to join ${organizationName}`,
    react: (
      <InviteMemberEmail
        inviterName={inviterName}
        organizationName={organizationName}
        inviteUrl={inviteUrl}
        role={role}
      />
    ),
    from: fromEmail,
    tags: [
      { name: 'email_type', value: 'invite' },
      { name: 'organization', value: organizationName },
      { name: 'role', value: role },
    ],
  });
}
