/**
 * Journal entries registry.
 *
 * Each entry is referenced from the landing-page Journal section, the
 * `/journal` index, and the sitemap. Keep entries listed newest-first.
 *
 * Bodies live in their own route files (e.g. `app/journal/<slug>/page.tsx`)
 * so they can be authored as JSX without an MDX pipeline. The metadata here
 * is the canonical source for title / dek / date / slug — the entry page,
 * the index card, and the landing-page leaf all read from this file so
 * nothing drifts.
 */

export interface JournalEntryMeta {
  /** URL-safe slug. Used as the route segment under `/journal/`. */
  slug: string;
  /** Stable identifier for landing-page leaf rendering. */
  num: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  /** Display date — short form used in cards and leaves. */
  dateDisplay: { en: string; zh: string };
  /** Title as it appears at the top of the entry. */
  title: { en: string; zh: string };
  /** Short marketing dek shown on the index card. ~1 sentence. */
  dek: { en: string; zh: string };
  /** Title for landing-page leaf rendering (may include <em>). */
  leafTitle: { en: React.ReactNode; zh: React.ReactNode };
  /** Meta description used for <head>. */
  metaDescription: string;
}

export const journalEntries: JournalEntryMeta[] = [
  {
    slug: 'why-most-ai-projects-fail',
    num: 'No. 001',
    date: '2026-05-05',
    dateDisplay: {
      en: '5 May 2026',
      zh: '2026年5月5日',
    },
    title: {
      en: 'Why most AI implementation projects fail',
      zh: '為何大多數 AI 實施項目皆告失敗',
    },
    dek: {
      en: "Most AI projects fail not because the technology doesn't work, but because they chase features instead of solving actual problems.",
      zh: '大多數 AI 項目失敗，並非因為技術不行，而是因為它們追逐功能，而非解決實際問題。',
    },
    leafTitle: {
      en: (
        <>
          Why most AI implementation projects <em>fail</em>.
          <span aria-hidden="true" className="leaf-arrow">
            {' →'}
          </span>
        </>
      ),
      zh: (
        <>
          為何大多數 AI 實施項目皆告<em>失敗</em>。
          <span aria-hidden="true" className="leaf-arrow">
            {' →'}
          </span>
        </>
      ),
    },
    metaDescription:
      "Most AI projects fail not because the technology doesn't work, but because they chase features instead of solving actual problems. Here's what makes implementation actually stick.",
  },
];

export function getEntryBySlug(slug: string): JournalEntryMeta | undefined {
  return journalEntries.find((entry) => entry.slug === slug);
}
