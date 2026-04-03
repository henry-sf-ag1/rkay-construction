import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const projectType = formData.get("projectType") as string;
    const description = formData.get("description") as string;
    const files = formData.getAll("attachment") as File[];

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    // Build email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1B2838; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Quote Request</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee; width: 140px;">Name</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;">Phone</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;">Project Type</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">${projectType || "Not specified"}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; vertical-align: top;">Description</td>
              <td style="padding: 12px;">${description ? description.replace(/\n/g, "<br>") : "No description provided"}</td>
            </tr>
          </table>
          ${files.filter(f => f.size > 0).length > 0 ? `<p style="margin-top: 16px; color: #666; font-style: italic;">${files.filter(f => f.size > 0).length} file(s) attached</p>` : ""}
        </div>
        <div style="padding: 12px; text-align: center; color: #999; font-size: 12px;">
          Sent from R Kay Construction website
        </div>
      </div>
    `;

    // Check for SMTP credentials
    const smtpUser = process.env.SMTP_USER;
    const smtpClientId = process.env.SMTP_CLIENT_ID;
    const smtpClientSecret = process.env.SMTP_CLIENT_SECRET;
    const smtpRefreshToken = process.env.SMTP_REFRESH_TOKEN;

    if (!smtpUser || !smtpClientId || !smtpClientSecret || !smtpRefreshToken) {
      console.warn("⚠️  SMTP credentials not set — running in demo mode.");
      console.log("Quote request received:", { name, email, phone, projectType, description, fileCount: files.filter(f => f.size > 0).length });
      return NextResponse.json({ success: true, demo: true });
    }

    // Create transporter with Google OAuth2
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: smtpUser,
        clientId: smtpClientId,
        clientSecret: smtpClientSecret,
        refreshToken: smtpRefreshToken,
      },
    });

    // Process file attachments
    const attachments = await Promise.all(
      files
        .filter((file) => file.size > 0)
        .map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          return {
            filename: file.name,
            content: buffer,
          };
        })
    );

    await transporter.sendMail({
      from: `"R Kay Construction Website" <${smtpUser}>`,
      to: "ryan@rkayconstruction.co.uk",
      replyTo: email,
      subject: `New Quote Request — ${name} (${projectType || "General"})`,
      html: emailHtml,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quote form error:", error);
    return NextResponse.json(
      { error: "Failed to process quote request." },
      { status: 500 }
    );
  }
}
