import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy (Next.js 16 — formerly Middleware) — gates the /deck route behind
 * a static cookie. If the cookie is absent or invalid, rewrites to the
 * unlock screen so the deck HTML never ships to unauthed visitors.
 *
 * Password is "maison" (case-insensitive). Verified server-side in the
 * unlock route's server action; on success the action sets `am-deck=open`
 * which this proxy admits.
 *
 * Intentionally not a security boundary — the operator just wants the deck
 * to not render publicly. A static token is enough; no hashing.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Allow the unlock screen and any of its subpaths through unmodified.
  if (pathname === '/deck/unlock' || pathname.startsWith('/deck/unlock/')) {
    return NextResponse.next();
  }

  // Only enforce on /deck and any nested deck routes.
  if (pathname !== '/deck' && !pathname.startsWith('/deck/')) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get('am-deck');
  if (cookie?.value === 'open') {
    return NextResponse.next();
  }

  // No valid cookie — rewrite (not redirect) to the unlock screen so the
  // user keeps the original /deck URL in the address bar and the unauthed
  // HTML response only contains the unlock UI.
  const url = request.nextUrl.clone();
  url.pathname = '/deck/unlock';
  // Preserve the originally requested path so the action can redirect back.
  url.search = `?from=${encodeURIComponent(pathname + search)}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/deck', '/deck/:path*'],
};
