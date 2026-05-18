import type { Metadata } from 'next';
import './deck.css';

/**
 * Deck route layout — applies noindex/nofollow to every page under /deck,
 * including the unlock gate. Paired with:
 *   - `src/app/robots.ts` Disallow: /deck
 *   - `src/app/sitemap.ts` does not include /deck routes
 *   - `src/proxy.ts` cookie gate
 *
 * The deck deliberately does NOT inherit `SheetShell` — a deck doesn't want
 * the site's sticky nav band covering slides. Each page under /deck renders
 * its own minimal top control strip.
 */
export const metadata: Metadata = {
  title: 'AI Practice · Agentic Maison',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
  },
};

export default function DeckLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
