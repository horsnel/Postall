import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

let resend: Resend | null = null

function getResendClient(): Resend | null {
  if (!RESEND_API_KEY || RESEND_API_KEY === 're_resend_placeholder_key') {
    console.warn('[Email Service] RESEND_API_KEY not configured. Emails will not be sent.')
    return null
  }
  if (!resend) {
    resend = new Resend(RESEND_API_KEY)
  }
  return resend
}

// ─── Shared email styles ─────────────────────────────────────────

const baseStyles = `
  body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; }
  .container { max-width: 480px; margin: 0 auto; padding: 24px 16px; }
  .card { background: #ffffff; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
  .header { background: linear-gradient(135deg, #059669, #0d9488); padding: 32px 24px; text-align: center; }
  .logo { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 12px; margin-bottom: 16px; }
  .logo-text { color: #ffffff; font-weight: 800; font-size: 18px; letter-spacing: -0.5px; }
  .title { color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 4px 0; }
  .subtitle { color: rgba(255,255,255,0.85); font-size: 14px; margin: 0; }
  .content { padding: 32px 24px; }
  .body-text { color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0; }
  .button { display: inline-block; background: #059669; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px; text-align: center; }
  .button:hover { background: #047857; }
  .footer { padding: 20px 24px; text-align: center; border-top: 1px solid #f3f4f6; }
  .footer-text { color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0; }
  .footer-link { color: #059669; }
  .info-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 16px 0; }
  .info-text { color: #166534; font-size: 13px; line-height: 1.5; margin: 0; }
  .warning-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 16px 0; }
  .warning-text { color: #92400e; font-size: 13px; line-height: 1.5; margin: 0; }
  .badge { display: inline-block; background: rgba(255,255,255,0.2); color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
`

function wrapHtml(innerHtml: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${baseStyles}</style></head><body><div class="container"><div class="card">${innerHtml}</div></div></body></html>`
}

// ─── Magic Link Email ────────────────────────────────────────────

export async function sendMagicLinkEmail(to: string, token: string, name?: string) {
  const client = getResendClient()
  const verifyUrl = `${APP_URL}/auth/verify?token=${token}`
  const displayName = name || 'there'

  console.log(`[Email Service] Magic link for ${to}: ${verifyUrl}`)

  if (!client) {
    console.warn('[Email Service] Skipping send — no Resend client. Token:', token)
    return { success: false, token }
  }

  try {
    const { data, error } = await client.emails.send({
      from: 'PostAll <noreply@postall.com>',
      to: [to],
      subject: 'Your PostAll Magic Link — Sign In Instantly',
      html: wrapHtml(`
        <div class="header">
          <div class="logo"><span class="logo-text">PA</span></div>
          <h1 class="title">Welcome Back${name ? ', ' + displayName : ''}!</h1>
          <p class="subtitle">Your magic link is ready</p>
        </div>
        <div class="content">
          <p class="body-text">
            Click the button below to sign in to your PostAll account. This link will expire in <strong>30 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${verifyUrl}" class="button">Sign In to PostAll</a>
          </div>
          <p class="body-text" style="font-size: 13px; color: #6b7280;">
            If the button doesn't work, copy and paste this URL into your browser:
          </p>
          <p style="font-size: 12px; color: #6b7280; word-break: break-all; margin: 8px 0;">
            ${verifyUrl}
          </p>
          <div class="info-box">
            <p class="info-text">
              <span style="display:inline-flex;align-items:center;gap:6px;vertical-align:middle;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> This link can only be used once. If you didn't request this, you can safely ignore this email.</span>
            </p>
          </div>
        </div>
        <div class="footer">
          <p class="footer-text">
            PostAll — Nigeria's Largest P2P Marketplace<br>
            <a href="${APP_URL}" class="footer-link">${APP_URL}</a>
          </p>
        </div>
      `),
    })

    if (error) {
      console.error('[Email Service] Resend error:', error)
      return { success: false, token, error }
    }

    console.log('[Email Service] Email sent:', data?.id)
    return { success: true, token, emailId: data?.id }
  } catch (err) {
    console.error('[Email Service] Exception sending magic link:', err)
    return { success: false, token }
  }
}

// ─── Verification Status Email ───────────────────────────────────

export async function sendVerificationEmail(to: string, type: string, status: string, name?: string) {
  const client = getResendClient()
  const displayName = name || 'there'

  console.log(`[Email Service] Verification email to ${to}: ${type} → ${status}`)

  if (!client) return { success: false }

  const statusConfig: Record<string, { title: string; message: string; color: string; boxClass: string; textClass: string }> = {
    pending: {
      title: 'Verification Submitted',
      message: `Your ${type} verification has been received and is under review. We'll notify you once it's been reviewed, usually within 1-2 business days.`,
      color: '#f59e0b',
      boxClass: 'warning-box',
      textClass: 'warning-text',
    },
    verified: {
      title: 'Verification Approved!',
      message: `Congratulations, ${displayName}! Your ${type} has been verified successfully. You now have increased trust and visibility on the platform.`,
      color: '#059669',
      boxClass: 'info-box',
      textClass: 'info-text',
    },
    rejected: {
      title: 'Verification Update',
      message: `Your ${type} verification was not approved. This could be due to unclear images or incorrect document type. Please re-submit with clearer, higher-quality images.`,
      color: '#ef4444',
      boxClass: 'warning-box',
      textClass: 'warning-text',
    },
  }

  const config = statusConfig[status] || statusConfig.pending

  try {
    const { data, error } = await client.emails.send({
      from: 'PostAll <noreply@postall.com>',
      to: [to],
      subject: `PostAll: ${config.title}`,
      html: wrapHtml(`
        <div class="header">
          <div class="logo"><span class="logo-text">PA</span></div>
          <h1 class="title">${config.title}</h1>
          <p class="subtitle">Identity verification update</p>
        </div>
        <div class="content">
          <p class="body-text">Hi ${displayName},</p>
          <p class="body-text">${config.message}</p>
          <div class="${config.boxClass}">
            <p class="${config.textClass}">
              Status: <strong>${status.toUpperCase()}</strong>
            </p>
          </div>
          ${status === 'rejected' ? `
            <div style="text-align: center; margin: 24px 0;">
              <a href="${APP_URL}/dashboard/verify" class="button">Re-submit Documents</a>
            </div>
          ` : ''}
          ${status === 'verified' ? `
            <div style="text-align: center; margin: 24px 0;">
              <a href="${APP_URL}/dashboard" class="button">Go to Dashboard</a>
            </div>
          ` : ''}
        </div>
        <div class="footer">
          <p class="footer-text">
            PostAll — Nigeria's Largest P2P Marketplace<br>
            Questions? Reply to this email or contact support@postall.com
          </p>
        </div>
      `),
    })

    if (error) {
      console.error('[Email Service] Resend error:', error)
      return { success: false, error }
    }

    return { success: true, emailId: data?.id }
  } catch (err) {
    console.error('[Email Service] Exception sending verification email:', err)
    return { success: false }
  }
}

// ─── Welcome Email ───────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name?: string) {
  const client = getResendClient()
  const displayName = name || 'there'

  console.log(`[Email Service] Welcome email to ${to}`)

  if (!client) return { success: false }

  try {
    const { data, error } = await client.emails.send({
      from: 'PostAll <hello@postall.com>',
      to: [to],
      subject: 'Welcome to PostAll! Your account is ready',
      html: wrapHtml(`
        <div class="header">
          <div class="logo"><span class="logo-text">PA</span></div>
          <h1 class="title">Welcome to PostAll!</h1>
          <p class="subtitle">Nigeria's Largest P2P Marketplace</p>
        </div>
        <div class="content">
          <p class="body-text">Hi ${displayName},</p>
          <p class="body-text">
            Your account has been created and your email is verified. You're all set to start buying, selling, and connecting on PostAll!
          </p>
          <div class="info-box">
            <p class="info-text">
              <strong><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Escrow Protected:</strong> All transactions on PostAll are protected by our escrow system. Your money is safe until you confirm delivery.<br><br>
              <strong><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> 25+ Cities:</strong> Connect with people across Lagos, Abuja, Port Harcourt, Accra, and more.<br><br>
              <strong><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> No Password Needed:</strong> Just use your email magic link to sign in anytime.
            </p>
          </div>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${APP_URL}/dashboard" class="button">Go to Your Dashboard</a>
          </div>
          <p class="body-text" style="font-size: 13px;">
            Complete your profile to increase your trust score and get discovered by more people. A complete profile gets <strong>3x more views</strong>!
          </p>
        </div>
        <div class="footer">
          <p class="footer-text">
            PostAll — Nigeria's Largest P2P Marketplace<br>
            <a href="${APP_URL}" class="footer-link">${APP_URL}</a>
          </p>
        </div>
      `),
    })

    if (error) {
      console.error('[Email Service] Resend error:', error)
      return { success: false, error }
    }

    return { success: true, emailId: data?.id }
  } catch (err) {
    console.error('[Email Service] Exception sending welcome email:', err)
    return { success: false }
  }
}
