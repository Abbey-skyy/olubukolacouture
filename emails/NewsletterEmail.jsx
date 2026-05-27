import {
  Body, Container, Head, Html, Preview, Section, Text, Hr,
} from '@react-email/components';

export default function NewsletterEmail({ subject = '', htmlContent = '' }) {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brandName}>OLUBUKOLA COUTURE</Text>
          </Section>
          <Section style={content}>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </Section>
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              You are receiving this because you subscribed to Olubukola Couture updates.
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Olubukola Couture. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body       = { backgroundColor: '#FFFFF0', fontFamily: "'Helvetica Neue', sans-serif" };
const container  = { margin: '0 auto', maxWidth: '600px' };
const header     = { backgroundColor: '#555D50', padding: '32px 40px', textAlign: 'center' };
const brandName  = { color: '#D4AF37', fontSize: '22px', fontWeight: '700', letterSpacing: '6px', margin: '0' };
const content    = { padding: '40px', color: '#555D50', fontSize: '15px', lineHeight: '1.8' };
const divider    = { borderColor: '#e0e0d8', margin: '0 40px' };
const footer     = { padding: '24px 40px', textAlign: 'center' };
const footerText = { color: '#7A8273', fontSize: '11px', letterSpacing: '1px', margin: '4px 0' };
