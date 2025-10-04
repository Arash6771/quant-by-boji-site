import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, requestType } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Send notification email to you
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #667eea;">New Contact Form Submission</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Request Type:</strong> ${requestType}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <h3 style="color: #667eea;">Message:</h3>
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #667eea;">
            ${message.split('\n').join('<br>')}
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">
              This email was sent from the Quant by Boji contact form.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to you
    await sendEmail({
      to: 'support@quantbyboji.com',
      subject: `[Contact Form] ${subject}`,
      html: emailHTML
    });

    // Send confirmation email to user
    const confirmationHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Thank You for Contacting Us</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Thank You!</h1>
          </div>
          
          <div style="padding: 40px 30px;">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Hi ${name},</p>
            
            <p style="color: #666; margin-bottom: 20px;">
              Thank you for reaching out to Quant by Boji. We've received your message and will get back to you within 24 hours.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #667eea;">Your Message:</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p style="color: #666;">${message.split('\n').slice(0, 3).join('<br>')}${message.split('\n').length > 3 ? '...' : ''}</p>
            </div>
            
            <p style="color: #666; margin-bottom: 20px;">
              In the meantime, feel free to explore our <a href="https://www.quantbyboji.com/#features" style="color: #667eea; text-decoration: none;">features</a> or check out our <a href="https://www.quantbyboji.com/#pricing" style="color: #667eea; text-decoration: none;">pricing</a>.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://www.quantbyboji.com" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                Visit Our Website
              </a>
            </div>
          </div>
          
          <div style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; color: #999999; font-size: 12px;">
              © ${new Date().getFullYear()} Quant by Boji. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: 'Thank you for contacting Quant by Boji',
      html: confirmationHTML
    });

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
