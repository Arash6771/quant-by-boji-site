import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Quant by Boji <noreply@quantbyboji.com>',
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send email');
    }

    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

// Email templates
export function getVerificationEmailHTML(verificationUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Quant by Boji</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">Verify Your Email Address</h2>
                  <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                    Thank you for creating an account with Quant by Boji! To complete your registration and start accessing our quantitative tools, please verify your email address.
                  </p>
                  <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                    Click the button below to verify your email:
                  </p>
                  
                  <!-- Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                          Verify Email Address
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 30px 0 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
                  </p>
                  
                  <p style="margin: 20px 0 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
                    This link will expire in 24 hours. If you didn't create an account with Quant by Boji, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    © ${new Date().getFullYear()} Quant by Boji. All rights reserved.
                  </p>
                  <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
                    <a href="https://www.quantbyboji.com" style="color: #667eea; text-decoration: none;">Visit our website</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
