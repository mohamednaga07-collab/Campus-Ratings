import nodemailer from "nodemailer";

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER || "mohamednaga07@gmail.com";
const EMAIL_PASSWORD = (process.env.EMAIL_PASSWORD || "ytwzsquhkukwldpc").replace(/\s/g, "");
const EMAIL_FROM = process.env.EMAIL_FROM || `Campus Ratings <${EMAIL_USER}>`;

// Mailgun configuration (preferred for production)
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const USE_MAILGUN = !!(MAILGUN_API_KEY && MAILGUN_DOMAIN);

console.log("[Email Setup] Initializing with:");
console.log(`  EMAIL_USER: ${EMAIL_USER}`);
console.log(`  Using Mailgun: ${USE_MAILGUN}`);
if (USE_MAILGUN) {
  console.log(`  Mailgun Domain: ${MAILGUN_DOMAIN}`);
}

// Create Gmail transporter as fallback
// Try port 587 with STARTTLS first (better compatibility with hosting providers)
const gmailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
  connectionTimeout: 10000, 
  greetingTimeout: 10000,   
  socketTimeout: 10000,
  requireTLS: true,
});

// Test Gmail connection
gmailTransporter.verify((error, success) => {
  if (error) {
    console.error("⚠️  Gmail SMTP not available:", error.message);
    if (!USE_MAILGUN) {
      console.log("💡 To enable email sending, either:");
      console.log("   Option 1: Set up Mailgun (recommended for hosting providers)");
      console.log("     - Sign up at https://www.mailgun.com/");
      console.log("     - Get API key and domain");
      console.log("     - Set MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables");
      console.log("   Option 2: Use Gmail with App Password");
      console.log("     - Enable 2FA on Gmail");
      console.log("     - Generate app password at https://myaccount.google.com/apppasswords");
      console.log("     - Set EMAIL_USER and EMAIL_PASSWORD environment variables");
    }
  } else {
    console.log("✅ Gmail SMTP available as fallback");
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    console.log(`[Email Send] Starting email send...`);
    console.log(`  To: ${options.to}`);
    console.log(`  Subject: ${options.subject}`);

    // Try Mailgun first if configured
    if (USE_MAILGUN) {
      console.log(`  Using Mailgun API`);
      try {
        const auth = Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');
        const formData = new URLSearchParams();
        formData.append('from', EMAIL_FROM);
        formData.append('to', options.to);
        formData.append('subject', options.subject);
        formData.append('html', options.html);

        const response = await fetch(
          `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${auth}`,
            },
            body: formData,
          }
        );

        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(`Mailgun API error: ${response.status} ${JSON.stringify(responseData)}`);
        }
        
        console.log(`[Email Send] ✅ Email sent via Mailgun: ${responseData.id}`);
        return true;
      } catch (mailgunError: any) {
        console.error(`[Email Send] ❌ Mailgun failed:`, mailgunError.message);
        console.log(`[Email Send] Falling back to Gmail...`);
        // Fall through to Gmail
      }
    }

    // Fallback to Gmail
    console.log(`  Using Gmail SMTP`);
    const info = await gmailTransporter.sendMail({
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log(`[Email Send] ✅ Email sent via Gmail: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[Email Send] ❌ Failed to send email to ${options.to}:`);
    console.error(`  Error type: ${error instanceof Error ? error.constructor.name : typeof error}`);
    console.error(`  Error message: ${error instanceof Error ? error.message : error}`);
    // Throw the error so the route handler knows it failed
    throw error;
  }
}

export function generateForgotPasswordEmailHtml(username: string, resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { padding: 20px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { font-size: 12px; color: #999; text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Reset Your Password</h2>
        </div>
        <div class="content">
          <p>Hi ${username},</p>
          <p>We received a request to reset your password. Click the button below to create a new password.</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2026 Campus Ratings. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateForgotUsernameEmailHtml(username: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { padding: 20px; }
        .username-box { background: #f5f5f5; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; font-family: monospace; font-size: 16px; }
        .footer { font-size: 12px; color: #999; text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Your Username</h2>
        </div>
        <div class="content">
          <p>Hi there,</p>
          <p>Your username for Campus Ratings is:</p>
          <div class="username-box">${username}</div>
          <p>You can use this username to log in to your account.</p>
          <p>If you didn't request this information, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2026 Campus Ratings. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
