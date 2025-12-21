import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Preview,
  Heading,
  Link,
} from '@react-email/components';

export interface InviteMemberEmailProps {
  inviterName: string;
  organizationName: string;
  inviteUrl: string;
  recipientEmail?: string; // Optional since it's not used in the template
  role: string;
}

export const InviteMemberEmail = ({
  inviterName,
  organizationName,
  inviteUrl,
  role,
}: InviteMemberEmailProps) => {
  return (
    <Html lang='en'>
      <Head />
      <Preview>
        {inviterName} has invited you to join {organizationName} on Accessly
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={h1}>
              You&apos;re invited to join {organizationName}
            </Heading>

            <Text style={text}>Hello,</Text>

            <Text style={text}>
              <strong>{inviterName}</strong> has invited you to join{' '}
              <strong>{organizationName}</strong> on Accessly as a{' '}
              <strong>{role}</strong>.
            </Text>

            <Text style={text}>
              Click the button below to accept the invitation and get started:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={inviteUrl}>
                Accept Invitation
              </Button>
            </Section>

            <Text style={text}>
              Or copy and paste this link into your browser:
            </Text>

            <Text style={linkText}>
              <Link href={inviteUrl} style={link}>
                {inviteUrl}
              </Link>
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              If you didn&apos;t expect this invitation, you can safely ignore
              this email.
            </Text>

            <Text style={footer}>This invitation will expire in 7 days.</Text>

            <Text style={footer}>
              If you have any questions, please contact {inviterName} or reply
              to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles using shadcn UI color scheme
const main = {
  backgroundColor: '#fafafa', // --muted equivalent
  fontFamily:
    'var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: '#ffffff', // --card
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px', // --radius
  boxShadow:
    '0 1px 2px 0 hsl(0 0% 0% / 0.18), 0 1px 2px -1px hsl(0 0% 0% / 0.18)', // --shadow
};

const box = {
  padding: '0 48px',
};

const h1 = {
  color: '#000000', // --foreground
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  lineHeight: '1.2',
};

const text = {
  color: '#000000', // --foreground
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#000000', // --primary
  color: '#ffffff', // --primary-foreground
  borderRadius: '8px', // --radius
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  width: '200px',
  margin: '0 auto',
  border: 'none',
  cursor: 'pointer',
};

const linkText = {
  margin: '16px 0',
  wordBreak: 'break-all' as const,
};

const link = {
  color: '#000000', // --foreground
  textDecoration: 'underline',
  fontSize: '14px',
};

const hr = {
  borderColor: '#e5e5e5', // --border
  margin: '32px 0',
  border: 'none',
  borderTop: '1px solid #e5e5e5',
};

const footer = {
  color: '#737373', // --muted-foreground
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
};

export default InviteMemberEmail;
