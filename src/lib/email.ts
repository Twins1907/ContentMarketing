import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const FROM_EMAIL = "Orbyt <hello@getorbyt.io>";

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name?: string | null;
}) {
  const resend = getResend();
  const firstName = name?.split(" ")[0] ?? "there";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Orbyt</title>
</head>
<body style="margin:0;padding:0;background-color:#FFF8F0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF8F0;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;">
              <span style="font-size:28px;font-weight:900;letter-spacing:-1px;color:#000000;text-transform:uppercase;">ORBYT</span>
            </td>
          </tr>

          <!-- Hero card -->
          <tr>
            <td style="background:#ffffff;border:2px solid #000000;border-radius:16px;box-shadow:4px 4px 0px #000000;padding:40px 40px 32px;">

              <p style="margin:0 0 8px 0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#918EFA;">Welcome aboard</p>
              <h1 style="margin:0 0 16px 0;font-size:32px;font-weight:900;color:#000000;line-height:1.2;">Hey ${firstName}, your account is ready.</h1>
              <p style="margin:0 0 28px 0;font-size:16px;color:#555555;line-height:1.6;">
                You're now one step away from having a complete AI-generated content strategy tailored to your business.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#918EFA;border:2px solid #000000;border-radius:8px;box-shadow:3px 3px 0px #000000;">
                    <a href="https://getorbyt.io/onboarding" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#000000;text-decoration:none;">
                      Build My Strategy →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #f0f0f0;padding-top:28px;">
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#888888;">Here's what to do next</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:12px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;height:28px;background:#A8F0C6;border:2px solid #000;border-radius:50%;text-align:center;font-weight:900;font-size:13px;color:#000;vertical-align:middle;" align="center">1</td>
                        <td style="padding-left:12px;font-size:15px;color:#222222;font-weight:600;">Tell us about your business</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:12px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;height:28px;background:#A8A6FF;border:2px solid #000;border-radius:50%;text-align:center;font-weight:900;font-size:13px;color:#000;vertical-align:middle;" align="center">2</td>
                        <td style="padding-left:12px;font-size:15px;color:#222222;font-weight:600;">Define your audience &amp; goals</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;height:28px;background:#FFD166;border:2px solid #000;border-radius:50%;text-align:center;font-weight:900;font-size:13px;color:#000;vertical-align:middle;" align="center">3</td>
                        <td style="padding-left:12px;font-size:15px;color:#222222;font-weight:600;">Get your full AI-generated strategy</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:28px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:13px;color:#999999;">You're receiving this because you signed up at <a href="https://getorbyt.io" style="color:#918EFA;text-decoration:none;">getorbyt.io</a>.</p>
              <p style="margin:0;font-size:13px;color:#999999;">© ${new Date().getFullYear()} Orbyt. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Welcome to Orbyt — let's build your strategy",
    html,
  });
}
