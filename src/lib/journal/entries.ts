/**
 * Journal entries registry.
 *
 * Metadata is sourced from the YAML frontmatter of each entry's `index.en.md`
 * and, when it exists, `index.zh.md`. Slugs are discovered by scanning
 * `src/content/journal/`. Entries are sorted by `date` descending (newest
 * first). Nothing is listed by hand — adding a folder with `index.en.md` in it
 * is enough.
 *
 * An entry with no `index.zh.md` is complete, not broken: its `zh` fields carry
 * the English values and `hasZh` is false. Read `hasZh` before treating a `zh`
 * value as Chinese — it is what tells a renderer to mark the text `lang="en"`,
 * and what keeps the page out of the `zh-HK` half of the sitemap.
 *
 * ## What is derived here rather than written by hand
 *
 * `num` and `dateDisplay` are not frontmatter. They are computed once, here,
 * so that the entry pages, the index, the homepage leaves and the sitemap can
 * never disagree about them:
 *
 * - `num` counts up the date-ascending list, so No. 001 is the oldest post.
 *   The trade, accepted deliberately: publishing a backdated post renumbers
 *   every post after it.
 * - `dateDisplay` is `date` formatted per locale by `formatEntryDate`.
 *
 * Nothing downstream may re-derive either. A component that formats a date
 * itself is the bug this arrangement exists to prevent.
 *
 * The journal index, sitemap, and entry pages use the full list; the
 * homepage uses `getJournalEntries({ limit: JOURNAL_LANDING_LIMIT })`.
 */

import {
  formatEntryDate,
  formatIssueNumber,
  getJournalSlugs,
  hasEntryLocale,
  parseRawMeta,
  sourceLocale,
} from '@/lib/journal/mdx';

export interface JournalEntryMeta {
  /** URL-safe slug. Used as the route segment under `/journal/`. */
  slug: string;
  /**
   * Whether this entry has an `index.zh.md`.
   *
   * When false every `zh` field below holds the English value, because the
   * `/zh/` route serves the English article. Anything that renders, links to or
   * declares the language of an entry has to consult this.
   */
  hasZh: boolean;
  /** Issue number, derived from this entry's position in date order. */
  num: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  /** Display date, derived from `date` — short form used in cards and leaves. */
  dateDisplay: { en: string; zh: string };
  /** Title as it appears at the top of the entry. */
  title: { en: string; zh: string };
  /** Title for the entry page h1 — the title with its terminal period. */
  entryTitle: { en: string; zh: string };
  /**
   * One sentence describing the post. Shown on the index card, as the entry's
   * standfirst, and as the `<head>` description. One field, one job.
   */
  description: { en: string; zh: string };
  /** Author key (references authors.ts registry). */
  author: string;
}

/** The h1 reads as a sentence, so it ends like one. */
function withTerminalPeriod(title: string, lang: 'en' | 'zh'): string {
  return `${title}${lang === 'zh' ? '。' : '.'}`;
}

/** Everything but `num`, which only the sorted set below can supply. */
function buildEntry(slug: string): Omit<JournalEntryMeta, 'num'> {
  const enMeta = parseRawMeta(slug, 'en');
  // For an English-only entry this reads index.en.md a second time from the
  // loader's cache, so every `zh` field below is the English value.
  const zhMeta = parseRawMeta(slug, sourceLocale(slug, 'zh'));
  if (enMeta.slug !== slug || zhMeta.slug !== slug) {
    throw new Error(
      `Journal meta.slug must match folder name "${slug}" (en: ${enMeta.slug}, zh: ${zhMeta.slug})`
    );
  }
  return {
    slug,
    hasZh: hasEntryLocale(slug, 'zh'),
    date: enMeta.date,
    dateDisplay: {
      en: formatEntryDate(enMeta.date, 'en'),
      zh: formatEntryDate(enMeta.date, 'zh'),
    },
    title: {
      en: enMeta.title,
      zh: zhMeta.title,
    },
    entryTitle: {
      en: withTerminalPeriod(enMeta.title, 'en'),
      zh: withTerminalPeriod(zhMeta.title, 'zh'),
    },
    description: {
      en: enMeta.description,
      zh: zhMeta.description,
    },
    author: enMeta.author,
  };
}

/** Max entries on the homepage Journal section (3-column leaf grid). */
export const JOURNAL_LANDING_LIMIT = 3;

export const journalEntries: JournalEntryMeta[] = getJournalSlugs()
  .map((slug) => buildEntry(slug))
  // Oldest first, only so the issue numbers can be counted off in publication
  // order; the exported list is newest first, as every consumer expects.
  .sort((a, b) => a.date.localeCompare(b.date))
  .map((entry, index) => ({ ...entry, num: formatIssueNumber(index) }))
  .reverse();

/** Newest-first journal list; optional `limit` for homepage-only previews. */
export function getJournalEntries(options?: {
  limit?: number;
}): JournalEntryMeta[] {
  const { limit } = options ?? {};
  if (limit == null) return journalEntries;
  return journalEntries.slice(0, limit);
}

export function getEntryBySlug(slug: string): JournalEntryMeta | undefined {
  return journalEntries.find((entry) => entry.slug === slug);
}
