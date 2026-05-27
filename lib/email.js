import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
}

export async function sendVerificationEmail(name, email, token) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Olubukola Couture" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Confirm your Olubukola Couture account',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:#555D50;padding:32px 40px;text-align:center;">
          <h1 style="color:#D4AF37;letter-spacing:6px;margin:0;font-size:20px;">OLUBUKOLA COUTURE</h1>
        </div>
        <div style="padding:40px;background:#FFFFF0;">
          <h2 style="color:#555D50;font-weight:400;letter-spacing:2px;">Confirm Your Email</h2>
          <p style="color:#555D50;font-size:15px;line-height:1.7;">Hello ${name},</p>
          <p style="color:#555D50;font-size:15px;line-height:1.7;">
            Click the button below to verify your email and activate your account.
          </p>
          <div style="text-align:center;margin:40px 0;">
            <a href="${verifyUrl}" style="background:#D4AF37;color:#3A4035;padding:16px 40px;
              font-size:13px;font-weight:700;letter-spacing:3px;text-decoration:none;display:inline-block;">
              CONFIRM EMAIL
            </a>
          </div>
          <p style="color:#7A8273;font-size:12px;">This link expires in 24 hours.</p>
        </div>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(name, email, token) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Olubukola Couture" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Reset your Olubukola Couture password',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:#555D50;padding:32px 40px;text-align:center;">
          <h1 style="color:#D4AF37;letter-spacing:6px;margin:0;font-size:20px;">OLUBUKOLA COUTURE</h1>
        </div>
        <div style="padding:40px;background:#FFFFF0;">
          <h2 style="color:#555D50;font-weight:400;letter-spacing:2px;">Reset Your Password</h2>
          <p style="color:#555D50;font-size:15px;line-height:1.7;">Hello ${name},</p>
          <p style="color:#555D50;font-size:15px;line-height:1.7;">
            Click below to reset your password. This link is valid for 1 hour.
          </p>
          <div style="text-align:center;margin:40px 0;">
            <a href="${resetUrl}" style="background:#D4AF37;color:#3A4035;padding:16px 40px;
              font-size:13px;font-weight:700;letter-spacing:3px;text-decoration:none;display:inline-block;">
              RESET PASSWORD
            </a>
          </div>
          <p style="color:#7A8273;font-size:12px;">If you did not request this, ignore this email.</p>
        </div>
      </div>
    `,
  });
}

export async function sendAccountDeletionEmail(name, email) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Olubukola Couture" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your Olubukola Couture account has been deleted',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:#555D50;padding:32px 40px;text-align:center;">
          <h1 style="color:#D4AF37;letter-spacing:6px;margin:0;font-size:20px;">OLUBUKOLA COUTURE</h1>
        </div>
        <div style="padding:40px;background:#FFFFF0;">
          <h2 style="color:#555D50;font-weight:400;letter-spacing:2px;">Account Deleted</h2>
          <p style="color:#555D50;font-size:15px;line-height:1.7;">Hello ${name},</p>
          <p style="color:#555D50;font-size:15px;line-height:1.7;">
            We're sorry to see you go. Your Olubukola Couture account and all associated
            personal data have been permanently deleted as requested.
          </p>
          <p style="color:#555D50;font-size:15px;line-height:1.7;">
            This includes your profile, wishlist, and order history. Any active orders
            placed before deletion will still be fulfilled — please contact us if you
            have any questions about an outstanding order.
          </p>
          <div style="background:#f5f5dc;border-left:3px solid #D4AF37;padding:16px 20px;margin:24px 0;">
            <p style="color:#555D50;font-size:13px;line-height:1.6;margin:0;">
              If you did not request this deletion or believe this was made in error,
              please contact us immediately at
              <a href="mailto:olubukolacoutore@writeme.com" style="color:#555D50;">olubukolacoutore@writeme.com</a>.
            </p>
          </div>
          <p style="color:#555D50;font-size:15px;line-height:1.7;">
            We hope to welcome you back one day. You are always welcome to create a new
            account at any time.
          </p>
          <p style="color:#7A8273;font-size:13px;margin-top:32px;">
            Warm regards,<br/>The Olubukola Couture Team
          </p>
        </div>
        <div style="padding:24px 40px;text-align:center;border-top:1px solid #e0e0d8;">
          <p style="color:#7A8273;font-size:11px;letter-spacing:1px;margin:4px 0;">
            © ${new Date().getFullYear()} Olubukola Couture Ltd. All rights reserved.
          </p>
          <p style="color:#7A8273;font-size:11px;letter-spacing:1px;margin:4px 0;">
            65 Periwinkle Close, Sittingbourne, Kent, ME10 2JU
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendNewsletterToAll(subject, htmlContent, recipients) {
  const transporter = createTransporter();
  const results = [];
  for (const email of recipients) {
    try {
      await transporter.sendMail({
        from: `"Olubukola Couture" <${process.env.GMAIL_USER}>`,
        to: email,
        subject,
        html: htmlContent,
      });
      results.push({ status: 'fulfilled', email });
    } catch (err) {
      results.push({ status: 'rejected', email, error: err.message });
    }
  }
  return results;
}