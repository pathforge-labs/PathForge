import { Resend } from "resend";
import { NextResponse } from "next/server";

// Force dynamic rendering — this route should never be statically analyzed
export const dynamic = "force-dynamic";

const LOGO_URL = "https://pathforge.eu/brand/logo-primary.png";
const SITE_URL = "https://pathforge.eu";

/**
 * Build a premium Tier-1 waitlist confirmation email.
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
    You're in! Welcome to PathForge — AI-powered Career Intelligence is coming your way. &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
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
                <strong style="color: #c4b5fd;">Career Intelligence</strong> powered by Career DNA™ technology.
              </p>
              <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 1.7; color: #94a3b8;">
                We're building something fundamentally different — not another resume builder,
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
                          🧬&nbsp;&nbsp;Career DNA™ — your unique professional fingerprint
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
                          🎯&nbsp;&nbsp;Semantic job matching with 95%+ accuracy
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
                          📊&nbsp;&nbsp;Real-time salary intelligence and market signals
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
                          🛡️&nbsp;&nbsp;Career Threat Radar™ — stay ahead of market shifts
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
                🇳🇱 Built in the Netherlands &bull; GDPR compliant from day one
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

    // Send premium confirmation email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "PathForge <hello@pathforge.eu>",
      to: email,
      subject: "Welcome to the PathForge Waitlist 🧬",
      html: buildWaitlistEmail(email),
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
