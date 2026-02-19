import { Resend } from "resend";
import { NextResponse } from "next/server";

// Force dynamic rendering -- this route should never be statically analyzed
export const dynamic = "force-dynamic";

const LOGO_URL = "https://pathforge.eu/brand/logo-primary.png";
const SITE_URL = "https://pathforge.eu";
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY ?? "";

// ── Types ──────────────────────────────────────────────────────
interface WaitlistPayload {
  email: string;
  turnstileToken?: string;
}

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

interface ResendContact {
  id: string;
  email: string;
  created_at: string;
  unsubscribed: boolean;
}

interface ResendContactListResponse {
  data: ResendContact[];
}

// ── Turnstile CAPTCHA ──────────────────────────────────────────
/**
 * Verify Cloudflare Turnstile token server-side.
 * Returns true if verified, false if failed.
 * Gracefully skips if no secret key is configured (dev mode).
 */
async function verifyTurnstile(token: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true;
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

// ── Rate Limiting ──────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;
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

// ── Duplicate Detection ────────────────────────────────────────
/**
 * Check if a contact already exists in the Resend audience.
 * Uses the Resend Contacts API to search by email.
 */
async function isExistingContact(
  resend: Resend,
  audienceId: string,
  email: string
): Promise<boolean> {
  try {
    const response = (await resend.contacts.list({
      audienceId,
    })) as unknown as { data: ResendContactListResponse };

    if (!response.data?.data) return false;

    return response.data.data.some(
      (contact) =>
        contact.email.toLowerCase() === email.toLowerCase() &&
        !contact.unsubscribed
    );
  } catch {
    // If we can't check, proceed with create (fallback to error-based detection)
    return false;
  }
}

// ── Email Templates ────────────────────────────────────────────

/**
 * Build premium Tier-1 waitlist confirmation email for NEW subscribers.
 *
 * Design benchmarks: Linear, Vercel, Resend welcome emails.
 * GDPR: unsubscribe link included in footer.
 */
function buildWaitlistEmail(recipientEmail: string): string {
  const year = new Date().getFullYear();
  const encodedEmail = encodeURIComponent(recipientEmail);

  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Welcome to PathForge</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; }
    a { color: #a78bfa; text-decoration: none; }
    a:hover { color: #c4b5fd; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px 16px !important; }
      .header-logo { width: 40px !important; height: 40px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050510; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Preheader (invisible preview text for email clients) -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    You're in! Welcome to PathForge -- AI-powered Career Intelligence is coming your way. &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #050510;">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <!-- Main container -->
        <table role="presentation" class="container" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; background-color: #0c0c1a; border-radius: 16px; overflow: hidden; border: 1px solid rgba(124, 58, 237, 0.15);">

          <!-- Gradient accent bar -->
          <tr>
            <td style="height: 3px; background: linear-gradient(90deg, #7c3aed, #06b6d4, #7c3aed); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Logo & Header -->
          <tr>
            <td style="padding: 40px 40px 0 40px; text-align: center;">
              <img src="${LOGO_URL}" alt="PathForge" class="header-logo" width="48" height="48" style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; margin-bottom: 24px;">
              <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.02em; line-height: 1.2;">
                You're on the list!
              </h1>
              <p style="margin: 0; font-size: 15px; color: #64748b; line-height: 1.5;">
                Welcome to the future of career intelligence
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px 0 40px;">
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.7; color: #94a3b8;">
                Thanks for joining the PathForge waitlist. You'll be among the first to experience
                <strong style="color: #c4b5fd;">Career Intelligence</strong> powered by Career DNA&#8482; technology.
              </p>
              <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 1.7; color: #94a3b8;">
                We're building something fundamentally different -- not another resume builder,
                but an AI-powered career strategy platform that understands your unique trajectory.
              </p>
            </td>
          </tr>

          <!-- What you'll get section -->
          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(6, 182, 212, 0.05)); border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 12px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 16px 0; font-size: 13px; font-weight: 600; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.05em;">
                      What's Coming
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
                          &#129516;&nbsp;&nbsp;Career DNA&#8482; -- your unique professional fingerprint
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
                          &#127919;&nbsp;&nbsp;Semantic job matching with 95%+ accuracy
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
                          &#128202;&nbsp;&nbsp;Real-time salary intelligence and market signals
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
                          &#128737;&#65039;&nbsp;&nbsp;Career Threat Radar&#8482; -- stay ahead of market shifts
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 32px 40px 0 40px; text-align: center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 10px; background: linear-gradient(135deg, #7c3aed, #06b6d4);">
                    <a href="${SITE_URL}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; letter-spacing: 0.01em;">
                      Explore PathForge &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Social proof -->
          <tr>
            <td style="padding: 24px 40px 0 40px; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
                &#127475;&#127473; Built in the Netherlands &bull; GDPR compliant from day one
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
                    <a href="https://linkedin.com/company/pathforge" target="_blank" style="font-size: 13px; color: #64748b; text-decoration: none;">LinkedIn</a>
                  </td>
                  <td style="color: #334155; font-size: 13px;">&bull;</td>
                  <td style="padding: 0 8px;">
                    <a href="https://x.com/pathforge" target="_blank" style="font-size: 13px; color: #64748b; text-decoration: none;">X (Twitter)</a>
                  </td>
                  <td style="color: #334155; font-size: 13px;">&bull;</td>
                  <td style="padding: 0 8px;">
                    <a href="https://instagram.com/pathforge" target="_blank" style="font-size: 13px; color: #64748b; text-decoration: none;">Instagram</a>
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
                You're receiving this because you signed up at
                <a href="${SITE_URL}" style="color: #64748b;">pathforge.eu</a>.
                <br>
                <a href="${SITE_URL}/privacy" style="color: #64748b;">Privacy Policy</a>
                &nbsp;&bull;&nbsp;
                <a href="mailto:hello@pathforge.eu?subject=Unsubscribe&body=Please%20remove%20${encodedEmail}%20from%20the%20waitlist." style="color: #64748b;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- /Main container -->

      </td>
    </tr>
  </table>
  <!-- /Outer wrapper -->

</body>
</html>`;
}

/**
 * Build a premium "Already on the list!" email for returning subscribers.
 * Reassures them they're secured, re-excites with upcoming features.
 */
function buildAlreadyOnListEmail(recipientEmail: string): string {
  const year = new Date().getFullYear();
  const encodedEmail = encodeURIComponent(recipientEmail);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>You're Already In -- PathForge</title>
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
    Good news -- your spot is already secured! Here's what's coming next. &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #050510;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; background-color: #0c0c1a; border-radius: 16px; overflow: hidden; border: 1px solid rgba(124, 58, 237, 0.15);">

          <!-- Gradient bar -->
          <tr>
            <td style="height: 3px; background: linear-gradient(90deg, #06b6d4, #7c3aed, #06b6d4); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Logo + Header -->
          <tr>
            <td style="padding: 40px 40px 0 40px; text-align: center;">
              <img src="${LOGO_URL}" alt="PathForge" width="48" height="48" style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; margin-bottom: 24px;">
              <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.02em; line-height: 1.2;">
                You're already in! &#128079;
              </h1>
              <p style="margin: 0; font-size: 15px; color: #64748b; line-height: 1.5;">
                Your spot on the waitlist is secured
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px 0 40px;">
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.7; color: #94a3b8;">
                Looks like you tried to sign up again -- no worries, you're
                <strong style="color: #c4b5fd;">already on the list</strong>!
                Your early access spot is safe and sound.
              </p>
              <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #94a3b8;">
                We're working hard to bring you something exceptional.
                You'll be among the first to know when we launch.
              </p>
            </td>
          </tr>

          <!-- Status card -->
          <tr>
            <td style="padding: 28px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(124, 58, 237, 0.05)); border: 1px solid rgba(6, 182, 212, 0.12); border-radius: 12px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #22d3ee; text-transform: uppercase; letter-spacing: 0.05em;">
                      Your Status
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
                          &#9989;&nbsp;&nbsp;Waitlist: <strong style="color: #34d399;">Confirmed</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
                          &#128640;&nbsp;&nbsp;Priority: <strong style="color: #c4b5fd;">Early Adopter</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
                          &#127911;&nbsp;&nbsp;Next update: Before launch
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 28px 40px 0 40px; text-align: center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 10px; background: linear-gradient(135deg, #06b6d4, #7c3aed);">
                    <a href="${SITE_URL}/features" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; letter-spacing: 0.01em;">
                      Explore Features &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 28px 40px 0 40px;">
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
                <a href="${SITE_URL}/privacy" style="color: #64748b;">Privacy Policy</a>
                &nbsp;&bull;&nbsp;
                <a href="mailto:hello@pathforge.eu?subject=Unsubscribe&body=Please%20remove%20${encodedEmail}%20from%20the%20waitlist." style="color: #64748b;">Unsubscribe</a>
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

// ── POST Handler ───────────────────────────────────────────────

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // ── Rate limiting ──────────────────────────────────────────
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    // ── Parse & validate ───────────────────────────────────────
    const body = (await request.json()) as WaitlistPayload;
    const { email, turnstileToken } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    // ── Turnstile CAPTCHA ──────────────────────────────────────
    const captchaVerified = await verifyTurnstile(turnstileToken ?? "");

    if (TURNSTILE_SECRET && !captchaVerified) {
      return NextResponse.json(
        { error: "CAPTCHA verification failed. Please try again." },
        { status: 422 }
      );
    }

    // ── Service check ──────────────────────────────────────────
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

    const fromAddress =
      process.env.RESEND_FROM_EMAIL || "PathForge <hello@pathforge.eu>";

    // ── Duplicate detection ────────────────────────────────────
    if (AUDIENCE_ID) {
      const alreadyExists = await isExistingContact(
        resend,
        AUDIENCE_ID,
        email
      );

      if (alreadyExists) {
        // Send "already on list" email (only if CAPTCHA passed)
        if (captchaVerified) {
          await resend.emails.send({
            from: fromAddress,
            to: email,
            subject: "Your PathForge spot is secured! \u{1F389}",
            html: buildAlreadyOnListEmail(email),
          });
        }

        return NextResponse.json(
          {
            message:
              "You're already on the waitlist! Check your inbox for confirmation.",
            isReturning: true,
          },
          { status: 200 }
        );
      }

      // ── New subscriber: create contact ─────────────────────
      await resend.contacts.create({
        email,
        audienceId: AUDIENCE_ID,
        unsubscribed: false,
      });
    }

    // ── Send welcome email ─────────────────────────────────────
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "Welcome to the PathForge Waitlist \u{1F9EC}",
      html: buildWaitlistEmail(email),
    });

    return NextResponse.json(
      {
        message: "Successfully joined the waitlist!",
        isReturning: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Waitlist signup error:", error);

    // Fallback: handle duplicate in case contact check failed
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        {
          message:
            "You're already on the waitlist! Check your inbox for confirmation.",
          isReturning: true,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
