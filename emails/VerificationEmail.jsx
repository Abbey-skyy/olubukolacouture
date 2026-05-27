import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Img, Preview, Section, Text,
} from '@react-email/components';

export default function VerificationEmail({ name = 'Valued Customer', verifyUrl = '#' }) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your Olubukola Couture email address</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={brandName}>OLUBUKOLA COUTURE</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Confirm Your Email</Heading>
            <Text style={paragraph}>Hello {name},</Text>
            <Text style={paragraph}>
              Thank you for creating an account with Olubukola Couture. To complete
              your registration and start exploring our curated collection, please
              confirm your email address.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={verifyUrl}>
                CONFIRM EMAIL
              </Button>
            </Section>

            <Text style={small}>
              This link expires in 24 hours. If you did not create an account,
              you can safely ignore this email.
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Olubukola Couture. All rights reserved.
            </Text>
            <Text style={footerText}>
              Women's Fashion · London
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: '#FFFFF0', fontFamily: "'Helvetica Neue', sans-serif" };

const container = {
  margin: '0 auto',
  maxWidth: '560px',
  backgroundColor: '#FFFFF0',
};

const header = {
  backgroundColor: '#555D50',
  padding: '32px 40px',
  textAlign: 'center',
};

const brandName = {
  color: '#D4AF37',
  fontSize: '22px',
  fontWeight: '700',
  letterSpacing: '6px',
  margin: '0',
};

const content = { padding: '48px 40px 32px' };

const h1 = {
  color: '#555D50',
  fontSize: '28px',
  fontWeight: '400',
  letterSpacing: '3px',
  marginBottom: '24px',
};

const paragraph = { color: '#555D50', fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px' };

const buttonContainer = { textAlign: 'center', margin: '40px 0' };

const button = {
  backgroundColor: '#D4AF37',
  color: '#555D50',
  padding: '16px 40px',
  fontSize: '13px',
  fontWeight: '700',
  letterSpacing: '3px',
  textDecoration: 'none',
  display: 'inline-block',
};

const small = { color: '#7A8273', fontSize: '12px', lineHeight: '1.6' };

const divider = { borderColor: '#e0e0d8', margin: '0 40px' };

const footer = { padding: '24px 40px', textAlign: 'center' };

const footerText = { color: '#7A8273', fontSize: '11px', letterSpacing: '1px', margin: '4px 0' };
