import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import {
  locales,
  defaultLocale,
  localeCookie,
  isLocale,
} from '@/i18n/config';

/**
 * Proxy (Next.js 16) — two responsibilities, in order:
 *
 * 1. Locale routing — detects language preference and redirects bare paths
 *    to their locale-prefixed counterparts (e.g. `/` → `/en/`).
 *    Skips deck paths entirely (they have no bilingual content).
 *
 * 2. Deck auth gating — if the locale-prefixed (or bare-deck) path is under
 *    `/deck`, checks for the `am-deck=open` cookie and rewrites to the
 *    unlock screen when absent.
 */

// ---------------------------------------------------------------------------
// Locale detection helpers
// ---------------------------------------------------------------------------

function getPreferredLocale(request: NextRequest): string {
  // 1. Cookie preference
  const cookieVal = request.cookies.get(localeCookie)?.value;
  if (cookieVal && isLocale(cookieVal)) return cookieVal;

  // 2. Accept-Language header
  const negotiator = new Negotiator({
    headers: { 'accept-language': request.headers.get('accept-language') || '' },
  });
  try {
    return match(negotiator.languages(), [...locales], defaultLocale);
  } catch {
    return defaultLocale;
  }
}

function pathnameHasLocale(pathname: string): boolean {
  return locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );
}

// ---------------------------------------------------------------------------
// Main proxy function
// ---------------------------------------------------------------------------

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // ── Skip internal / static paths ──────────────────────────────────────
  // (The matcher already excludes _next, but guard defensively.)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // ── Skip deck paths from locale routing ───────────────────────────────
  // Deck has no bilingual content; it stays at /deck/* with no locale prefix.
  if (pathname === '/deck' || pathname.startsWith('/deck/')) {
    return handleDeck(request, pathname, search);
  }

  // ── Locale routing ────────────────────────────────────────────────────
  if (!pathnameHasLocale(pathname)) {
    const locale = getPreferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url, 302);
  }

  // Path already has a locale prefix — pass through, forwarding the locale
  // as a request header so the root layout can read it server-side for
  // <html lang="..."> without needing to parse the URL itself.
  const localeSegment = pathname.split('/')[1];
  const resolvedLocale = isLocale(localeSegment) ? localeSegment : defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', resolvedLocale);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

// ---------------------------------------------------------------------------
// Deck auth gating (unchanged logic from previous proxy)
// ---------------------------------------------------------------------------

function handleDeck(
  request: NextRequest,
  pathname: string,
  search: string
) {
  // Allow the unlock screen through unmodified.
  if (pathname === '/deck/unlock' || pathname.startsWith('/deck/unlock/')) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get('am-deck');
  if (cookie?.value === 'open') {
    return NextResponse.next();
  }

  // No valid cookie — rewrite to the unlock screen.
  const url = request.nextUrl.clone();
  url.pathname = '/deck/unlock';
  url.search = `?from=${encodeURIComponent(pathname + search)}`;
  return NextResponse.rewrite(url);
}

// ---------------------------------------------------------------------------
// Matcher — run on all paths except static assets and metadata files.
// Deck paths are included because the proxy handles them (auth gating).
// ---------------------------------------------------------------------------

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|assets/|brand/|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
