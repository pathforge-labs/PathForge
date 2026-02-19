import { Resend } from "resend";
import { NextResponse } from "next/server";
import { APP_AUTHOR_EMAIL } from "@/config/brand";

// Force dynamic rendering — this route should never be statically analyzed
export const dynamic = "force-dynamic";

const LOGO_URL = "https://pathforge.eu/brand/logo-primary.png";
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY ?? "";

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken?: string;
}

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

/**
 * Verify Cloudflare Turnstile token server-side.
 * Returns true if verified, false if failed.
 * Gracefully skips if no secret key is configured.
 */
async function verifyTurnstile(token: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true; // Skip if not configured
  if (!token) return false;

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: TURNSTILE_SECRET,
          response: token,
        }),
      }
    );
    const result = (await response.json()) as TurnstileVerifyResponse;
    return result.success;
  } catch {
    console.error("Turnstile verification failed");
    return false;
  }
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

    const { name, email, subject, message, turnstileToken } = body;

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

    // ── Turnstile CAPTCHA verification ──────────────────────────
    const captchaVerified = await verifyTurnstile(turnstileToken ?? "");

    if (TURNSTILE_SECRET && !captchaVerified) {
      return NextResponse.json(
        { error: "CAPTCHA verification failed. Please try again." },
        { status: 422 }
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

    // ── Auto-reply to sender (CAPTCHA-protected) ──────────────────
    // Only send auto-reply when CAPTCHA is verified to prevent email bombing
    if (captchaVerified) {
      await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: `Thanks for reaching out — PathForge`,
        html: buildAutoReplyEmail(escapeHtml(name)),
      });
    }

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

/**
 * Build a premium Tier-1 auto-reply email for contact form submissions.
 * Matches the PathForge design system used in the waitlist email.
 */
function buildAutoReplyEmail(senderName: string): string {
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Thanks for reaching out — PathForge</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0; padding: 0; width: 100% !important; }
    a { color: #a78bfa; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050510; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Preheader -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    Thanks for reaching out! We'll get back to you within 24-48 hours.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #050510;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; background-color: #0c0c1a; border-radius: 16px; overflow: hidden; border: 1px solid rgba(124, 58, 237, 0.15);">

          <!-- Gradient bar -->
          <tr>
            <td style="height: 3px; background: linear-gradient(90deg, #7c3aed, #06b6d4, #7c3aed); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Logo + Header -->
          <tr>
            <td style="padding: 40px 40px 0 40px; text-align: center;">
              <img src="${LOGO_URL}" alt="PathForge" width="48" height="48" style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; margin-bottom: 24px;">
              <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.02em;">
                Thanks, ${senderName}!
              </h1>
              <p style="margin: 0; font-size: 15px; color: #64748b; line-height: 1.5;">
                We received your message
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px 0 40px;">
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.7; color: #94a3b8;">
                Thanks for getting in touch with PathForge. We appreciate you taking the time to write to us.
              </p>
              <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #94a3b8;">
                Our team will review your message and respond within
                <strong style="color: #c4b5fd;">24–48 hours</strong>.
                If your matter is urgent, feel free to follow up.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 32px 40px 0 40px;">
              <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(100, 116, 139, 0.2), transparent);"></div>
            </td>
          </tr>

          <!-- Social Links -->
          <tr>
            <td style="padding: 24px 40px 0 40px; text-align: center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="padding: 0 8px;">
                    <a href="https://linkedin.com/company/pathforge" target="_blank" style="font-size: 13px; color: #64748b;">LinkedIn</a>
                  </td>
                  <td style="color: #334155; font-size: 13px;">&bull;</td>
                  <td style="padding: 0 8px;">
                    <a href="https://x.com/pathforge" target="_blank" style="font-size: 13px; color: #64748b;">X (Twitter)</a>
                  </td>
                  <td style="color: #334155; font-size: 13px;">&bull;</td>
                  <td style="padding: 0 8px;">
                    <a href="https://instagram.com/pathforge" target="_blank" style="font-size: 13px; color: #64748b;">Instagram</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #475569; line-height: 1.6;">
                &copy; ${year} PathForge &mdash; Career Intelligence, Intelligently Forged.
              </p>
              <p style="margin: 0; font-size: 11px; color: #334155; line-height: 1.6;">
                <a href="https://pathforge.eu/privacy" style="color: #64748b;">Privacy Policy</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
