'use server';

import type { ContactFormState } from '@/app/actions/contact-form-state';
import { Resend } from 'resend';

/** Min time (ms) between form mount and submit — rejects instant bot posts. */
const MIN_SUBMIT_MS = 1_000;
/** Max age (ms) of the client mount timestamp — rejects stale/replayed tokens. */
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000;

const NAME_MIN = 2;
const NAME_MAX = 200;
const EMAIL_MAX = 254;
const COMPANY_MAX = 200;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 10_000;

/** Inbox that receives contact form notifications (must match a Resend-verified domain). */
const CONTACT_TO_EMAIL = 'studio@agenticmaison.com';

/**
 * Sender shown on outbound mail. Must be allowed by Resend for your verified domain
 * (same mailbox as `CONTACT_TO_EMAIL` is fine).
 */
const CONTACT_FROM_EMAIL =
  'Agenticmaison.com Contact Form <enquiries@agenticmaison.com>';

/**
 * Honeypot field name must match the hidden input in ContactForm.
 * If filled, accept silently (fake success) so bots cannot learn the failure mode.
 */
const HONEYPOT_FIELD = 'website_url';

function isValidEmail(value: string): boolean {
  if (value.length > EMAIL_MAX) return false;
  // Pragmatic RFC 5322–ish check for contact forms
  const re =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(value);
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const honeypot = (formData.get(HONEYPOT_FIELD)?.toString() ?? '').trim();
  if (honeypot.length > 0) {
    return {
      ok: true,
      messageEn: 'Thank you.',
      messageZh: '謝謝。',
    };
  }

  const openedAtRaw = formData.get('_opened_at')?.toString() ?? '';
  const openedAt = Number(openedAtRaw);
  const now = Date.now();
  if (
    !Number.isFinite(openedAt) ||
    now - openedAt < MIN_SUBMIT_MS ||
    now - openedAt > MAX_FORM_AGE_MS
  ) {
    return {
      ok: false,
      messageEn: 'Something went wrong. Please try again.',
      messageZh: '發生錯誤，請再試一次。',
    };
  }

  const name = (formData.get('name')?.toString() ?? '').trim();
  const email = (formData.get('email')?.toString() ?? '').trim();
  const company = (formData.get('company')?.toString() ?? '').trim();
  const message = (formData.get('message')?.toString() ?? '').trim();

  if (
    name.length < NAME_MIN ||
    name.length > NAME_MAX ||
    !isValidEmail(email) ||
    company.length > COMPANY_MAX ||
    message.length < MESSAGE_MIN ||
    message.length > MESSAGE_MAX
  ) {
    return {
      ok: false,
      messageEn: 'Please check the form and try again.',
      messageZh: '請檢查表單後再試。',
    };
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('submitContactForm: missing RESEND_API_KEY');
    return {
      ok: false,
      messageEn: 'We could not send your message. Please email us directly.',
      messageZh: '無法傳送訊息，請改以電郵聯絡。',
    };
  }

  const resend = new Resend(apiKey);

  const textBody = [
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : 'Company: (not provided)',
    '',
    'Message:',
    message,
    '',
    `Submitted at (server): ${new Date().toISOString()}`,
  ].join('\n');

  const htmlBody = `
<!DOCTYPE html>
<html><head><meta charset="utf-8" /></head><body>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Company:</strong> ${
    company ? escapeHtml(company) : '(not provided)'
  }</p>
<p><strong>Message:</strong></p>
<pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(
    message
  )}</pre>
<hr />
<p style="font-size:12px;color:#666;">Submitted at (server): ${escapeHtml(
    new Date().toISOString()
  )}</p>
</body></html>`;

  const { error } = await resend.emails.send({
    from: CONTACT_FROM_EMAIL,
    to: [CONTACT_TO_EMAIL],
    replyTo: email,
    subject: `Website enquiry from ${name}`,
    text: textBody,
    html: htmlBody,
  });

  if (error) {
    console.error('Resend error:', error);
    return {
      ok: false,
      messageEn: 'We could not send your message. Please try again later.',
      messageZh: '無法傳送訊息，請稍後再試。',
    };
  }

  return {
    ok: true,
    messageEn: 'Message sent. We will be in touch.',
    messageZh: '訊息已送出，我們將與您聯絡。',
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
