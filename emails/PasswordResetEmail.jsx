import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components';

export default function PasswordResetEmail({ name = 'Valued Customer', resetUrl = '#' }) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Olubukola Couture password</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brandName}>OLUBUKOLA COUTURE</Text>
          </Section>
          <Section style={content}>
            <Heading style={h1}>Reset Your Password</Heading>
            <Text style={paragraph}>Hello {name},</Text>
            <Text style={paragraph}>
              We received a request to reset the password for your account. Click the
              button below to choose a new password. This link is valid for 1 hour.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>RESET PASSWORD</Button>
            </Section>
            <Text style={small}>
              If you did not request a password reset, please ignore this email —
              your account remains secure.
            </Text>
          </Section>
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>© {new Date().getFullYear()} Olubukola Couture. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body           = { backgroundColor: '#FFFFF0', fontFamily: "'Helvetica Neue', sans-serif" };
const container      = { margin: '0 auto', maxWidth: '560px', backgroundColor: '#FFFFF0' };
const header         = { backgroundColor: '#555D50', padding: '32px 40px', textAlign: 'center' };
const brandName      = { color: '#D4AF37', fontSize: '22px', fontWeight: '700', letterSpacing: '6px', margin: '0' };
const content        = { padding: '48px 40px 32px' };
const h1             = { color: '#555D50', fontSize: '28px', fontWeight: '400', letterSpacing: '3px', marginBottom: '24px' };
const paragraph      = { color: '#555D50', fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px' };
const buttonContainer= { textAlign: 'center', margin: '40px 0' };
const button         = { backgroundColor: '#D4AF37', color: '#555D50', padding: '16px 40px', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', textDecoration: 'none', display: 'inline-block' };
const small          = { color: '#7A8273', fontSize: '12px', lineHeight: '1.6' };
const divider        = { borderColor: '#e0e0d8', margin: '0 40px' };
const footer         = { padding: '24px 40px', textAlign: 'center' };
const footerText     = { color: '#7A8273', fontSize: '11px', letterSpacing: '1px', margin: '4px 0' };
