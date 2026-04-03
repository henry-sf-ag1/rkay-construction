import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const projectType = formData.get("projectType") as string;
    const description = formData.get("description") as string;
    const files = formData.getAll("files") as File[];

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    // Build email HTML
    const emailHtml = `
      <h2>New Quote Request</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">Name</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">Phone</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">Project Type</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${projectType || "Not specified"}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">Description</td>
          <td style="padding: 8px 12px;">${description || "No description provided"}</td>
        </tr>
      </table>
      ${files.length > 0 ? `<p style="margin-top: 16px; color: #666;"><em>${files.length} file(s) attached</em></p>` : ""}
    `;

    // Check for Resend API key
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn(
        "⚠️  RESEND_API_KEY not set — running in demo mode. Quote request logged but not emailed."
      );
      console.log("Quote request received:", { name, email, phone, projectType, description, fileCount: files.length });
      return NextResponse.json({ success: true, demo: true });
    }

    // Send email via Resend
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);

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

    await resend.emails.send({
      from: "R Kay Construction <onboarding@resend.dev>",
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
