/**
 * Generated Open Graph image for a journal entry.
 *
 * Next wires `og:image`, `og:image:width`, `og:image:height`, `og:image:type`
 * and — because the segment has no `twitter-image` of its own — `twitter:image`
 * from this file. The URLs are made absolute against the `metadataBase` set in
 * `src/app/layout.tsx`. None of those tags are hand-written anywhere.
 *
 * The entry is looked up through the same accessors the page uses, so adding a
 * post is still a file drop: a new folder under `src/content/journal/` gets a
 * card in both locales with no other change.
 *
 * Runs on Node, not edge. The card needs the complete Noto Serif TC face read
 * from disk, and edge's bundle ceiling is the likeliest thing to break a build
 * carrying it.
 */

import { notFound } from 'next/navigation';
import { getEntryBySlug, journalEntries } from '@/lib/journal/entries';
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderJournalCard,
} from '@/lib/og/journal-card';
import { locales, isLocale } from '@/i18n/config';

export const runtime = 'nodejs';

export const alt = 'Agentic Maison — journal';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Mirrors the page's own params so every card is prerendered at build time
 * alongside the entry it belongs to. Without this the route would be rendered
 * on demand and would need the font traced into a serverless function.
 */
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    journalEntries.map((entry) => ({ locale, slug: entry.slug }))
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const entry = getEntryBySlug(slug);
  if (!entry) notFound();

  return renderJournalCard(entry.title[locale]);
}
