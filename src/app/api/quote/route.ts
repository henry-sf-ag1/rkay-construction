import { NextRequest, NextResponse } from "next/server";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SMTP_CLIENT_ID!;
  const clientSecret = process.env.SMTP_CLIENT_SECRET!;
  const refreshToken = process.env.SMTP_REFRESH_TOKEN!;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error("Failed to get access token: " + JSON.stringify(data));
  }
  return data.access_token;
}

function buildMimeMessage(
  from: string,
  to: string,
  replyTo: string,
  subject: string,
  htmlBody: string
): string {
  const boundary = "boundary_" + Date.now();
  const lines = [
    `From: "R Kay Construction Website" <${from}>`,
    `To: ${to}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 7bit",
    "",
    htmlBody,
    "",
    `--${boundary}--`,
  ];
  return lines.join("\r\n");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const projectType = formData.get("projectType") as string;
    const description = formData.get("description") as string;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1B2838; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Quote Request</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee; width: 140px;">Name</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${name}</td></tr>
            <tr><td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td><td style="padding: 12px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;">Phone</td><td style="padding: 12px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td></tr>
            <tr><td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #eee;">Project Type</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${projectType || "Not specified"}</td></tr>
            <tr><td style="padding: 12px; font-weight: bold; vertical-align: top;">Description</td><td style="padding: 12px;">${description ? description.replace(/\n/g, "<br>") : "No description provided"}</td></tr>
          </table>
        </div>
        <div style="padding: 12px; text-align: center; color: #999; font-size: 12px;">Sent from R Kay Construction website</div>
      </div>
    `;

    const smtpUser = process.env.SMTP_USER;
    if (!smtpUser || !process.env.SMTP_CLIENT_ID) {
      console.warn("SMTP credentials not set — demo mode");
      console.log("Quote:", { name, email, phone, projectType, description });
      return NextResponse.json({ success: true, demo: true });
    }

    const accessToken = await getAccessToken();

    const subject = `New Quote Request — ${name} (${projectType || "General"})`;
    const rawMessage = buildMimeMessage(
      smtpUser,
      "ryan@rkayconstruction.co.uk",
      email,
      subject,
      emailHtml
    );

    // Base64url encode the message
    const encodedMessage = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const gmailRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: encodedMessage }),
      }
    );

    if (!gmailRes.ok) {
      const err = await gmailRes.text();
      console.error("Gmail API error:", err);
      return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quote form error:", error);
    return NextResponse.json(
      { error: "Failed to process quote request." },
      { status: 500 }
    );
  }
}
