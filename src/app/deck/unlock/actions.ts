'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const DECK_PASSWORD = 'maison';
const COOKIE_NAME = 'am-deck';
const COOKIE_VALUE = 'open';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Only allow on-site paths beginning with /deck so a redirected `from`
// param can't be used to bounce the user off the domain.
function safeFrom(from: string | null): string {
  if (!from) return '/deck';
  if (!from.startsWith('/deck')) return '/deck';
  return from;
}

export type UnlockState = { error?: string };

/**
 * unlockDeck — verifies the submitted password (case-insensitive equality
 * against the hardcoded "maison") and, on success, sets the `am-deck`
 * cookie that proxy.ts admits. On failure, returns an error state.
 */
export async function unlockDeck(
  _prev: UnlockState,
  formData: FormData
): Promise<UnlockState> {
  const password = String(formData.get('password') ?? '').trim();
  const from = safeFrom(String(formData.get('from') ?? '/deck'));

  if (password.toLowerCase() !== DECK_PASSWORD) {
    return { error: 'Incorrect' };
  }

  const jar = await cookies();
  jar.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  redirect(from);
}
