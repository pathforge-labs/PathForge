import { Resend } from "resend";
import { NextResponse } from "next/server";

// Force dynamic rendering — this route should never be statically analyzed
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service not configured. Please try again later." },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Add contact to Resend Audience for waitlist
    if (AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        audienceId: AUDIENCE_ID,
        unsubscribed: false,
      });
    }

    // Send welcome/confirmation email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "PathForge <hello@pathforge.eu>",
      to: email,
      subject: "Welcome to the PathForge Waitlist 🧬",
      html: `
        <div style="font-family: 'Inter', 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #e2e8f0; background: #0a0a12;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #7c3aed, #06b6d4); margin-bottom: 16px;">
              <span style="font-size: 20px; font-weight: 800; color: #fff;">P</span>
            </div>
            <h1 style="font-size: 24px; font-weight: 700; margin: 0; color: #f1f5f9;">You're on the list!</h1>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px;">
            Thanks for joining the PathForge waitlist. You'll be among the first to experience
            Career Intelligence powered by Career DNA™ technology.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px;">
            We're building something fundamentally different — not another resume builder,
            but an AI-powered career strategy platform that understands your unique trajectory.
          </p>
          <div style="padding: 20px; border-radius: 12px; background: rgba(124, 58, 237, 0.1); border: 1px solid rgba(124, 58, 237, 0.2); margin-bottom: 24px;">
            <p style="font-size: 14px; color: #c4b5fd; margin: 0;">
              🧬 <strong>What's next?</strong> We'll notify you as soon as early access opens.
              Built with EU-native privacy (GDPR compliant from day one).
            </p>
          </div>
          <p style="font-size: 13px; color: #64748b; text-align: center; margin-top: 40px;">
            © ${new Date().getFullYear()} PathForge — Career Intelligence, Intelligently Forged.
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Successfully joined the waitlist!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Waitlist signup error:", error);

    // Handle duplicate contact gracefully
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { message: "You're already on the waitlist!" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
