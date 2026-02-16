import { Resend } from "resend";
import { NextResponse } from "next/server";
import { APP_AUTHOR_EMAIL } from "@/config/brand";

// Force dynamic rendering — this route should never be statically analyzed
export const dynamic = "force-dynamic";

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Simple in-memory rate limiting (resets on cold start)
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) ?? [];
  const recentTimestamps = timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  recentTimestamps.push(now);
  requestLog.set(ip, recentTimestamps);
  return false;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service not configured. Please try again later." },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const body = (await request.json()) as ContactPayload;

    const { name, email, subject, message } = body;

    // Validate required fields
    if (
      !name || typeof name !== "string" ||
      !email || typeof email !== "string" ||
      !subject || typeof subject !== "string" ||
      !message || typeof message !== "string"
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    // Length validation
    if (name.length > 100 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json(
        { error: "One or more fields exceed the maximum length." },
        { status: 400 }
      );
    }

    // Subject allowlist validation
    const VALID_SUBJECTS = [
      "General Inquiry",
      "Feature Request",
      "Bug Report",
      "Business / Partnerships",
      "Press / Media",
      "Other",
    ] as const;

    if (!VALID_SUBJECTS.includes(subject as (typeof VALID_SUBJECTS)[number])) {
      return NextResponse.json(
        { error: "Invalid subject selection." },
        { status: 400 }
      );
    }

    const fromAddress =
      process.env.RESEND_FROM_EMAIL || "PathForge <hello@pathforge.eu>";

    // Send email to the PathForge team
    await resend.emails.send({
      from: fromAddress,
      to: APP_AUTHOR_EMAIL,
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: 'Inter', 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #e2e8f0; background: #0a0a12;">
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 4px; color: #f1f5f9;">
              New Contact Form Submission
            </h2>
            <p style="font-size: 13px; color: #64748b; margin: 0;">
              Received via pathforge.eu/contact
            </p>
          </div>

          <div style="padding: 20px; border-radius: 12px; background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.15); margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #64748b; width: 80px; vertical-align: top;">Name</td>
                <td style="padding: 8px 0; font-size: 14px; color: #e2e8f0; font-weight: 500;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #64748b; vertical-align: top;">Email</td>
                <td style="padding: 8px 0; font-size: 14px; color: #e2e8f0;">
                  <a href="mailto:${escapeHtml(email)}" style="color: #c4b5fd; text-decoration: none;">${escapeHtml(email)}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #64748b; vertical-align: top;">Subject</td>
                <td style="padding: 8px 0; font-size: 14px; color: #e2e8f0; font-weight: 500;">${escapeHtml(subject)}</td>
              </tr>
            </table>
          </div>

          <div style="padding: 20px; border-radius: 12px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06);">
            <p style="font-size: 13px; color: #64748b; margin: 0 0 8px; font-weight: 600;">Message</p>
            <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>

          <p style="font-size: 12px; color: #475569; text-align: center; margin-top: 32px;">
            Reply directly to this email to respond to ${escapeHtml(name)}.
          </p>
        </div>
      `,
    });

    // NOTE: Auto-reply to sender intentionally omitted to prevent email bombing.
    // The contact form could be abused to send PathForge-branded emails to arbitrary
    // addresses. Auto-reply should only be re-enabled after adding CAPTCHA (e.g.,
    // Cloudflare Turnstile) or email verification.
    // TODO(production): Add Turnstile CAPTCHA, then re-enable auto-reply.

    return NextResponse.json(
      { message: "Message sent successfully! We'll be in touch soon." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/** Escape HTML special characters to prevent XSS in email templates */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
