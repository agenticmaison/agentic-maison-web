/**
 * Journal entries registry.
 *
 * Metadata is sourced from MDX `export const meta` in each entry's files.
 * Slugs are discovered by scanning `src/content/journal/`. Entries are sorted
 * by `date` descending (newest first).
 *
 * The `leafTitle` field is JSX for the landing-page leaf; the emphasized
 * substring comes from optional `leafEmphasis` on each MDX meta.
 *
 * The homepage Journal section, sitemap, and entry pages all read from
 * this file so nothing drifts.
 */

import type { ReactNode } from "react";
import {
  getJournalSlugs,
  parseRawMeta,
} from "@/lib/journal/mdx";

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
  leafTitle: { en: ReactNode; zh: ReactNode };
  /** Title for entry page h1 rendering (may include <em>). */
  entryTitle: { en: ReactNode; zh: ReactNode };
  /** Meta description used for <head>. */
  metaDescription: string;
  /** Author key (references authors.ts registry). */
  author: string;
}

function buildLeafTitle(title: string, emphasis: string | undefined): ReactNode {
  const arrow = (
    <span aria-hidden="true" className="leaf-arrow">
      {" →"}
    </span>
  );
  if (!emphasis) {
    return (
      <>
        {title}
        {arrow}
      </>
    );
  }
  const idx = title.indexOf(emphasis);
  if (idx === -1) {
    return (
      <>
        {title}
        {arrow}
      </>
    );
  }
  return (
    <>
      {title.slice(0, idx)}
      <em>{emphasis}</em>
      {title.slice(idx + emphasis.length)}
      {arrow}
    </>
  );
}

function buildEntryTitle(
  title: string,
  emphasis: string | undefined,
  lang: "en" | "zh"
): ReactNode {
  const period = lang === "zh" ? "。" : ".";
  if (!emphasis) {
    return (
      <>
        {title}
        {period}
      </>
    );
  }
  const idx = title.indexOf(emphasis);
  if (idx === -1) {
    return (
      <>
        {title}
        {period}
      </>
    );
  }
  return (
    <>
      {title.slice(0, idx)}
      <em>{emphasis}</em>
      {title.slice(idx + emphasis.length)}
      {period}
    </>
  );
}

function buildEntry(slug: string): JournalEntryMeta {
  const enMeta = parseRawMeta(slug, "en");
  const zhMeta = parseRawMeta(slug, "zh");
  if (enMeta.slug !== slug || zhMeta.slug !== slug) {
    throw new Error(
      `Journal meta.slug must match folder name "${slug}" (en: ${enMeta.slug}, zh: ${zhMeta.slug})`
    );
  }
  return {
    slug,
    num: enMeta.num,
    date: enMeta.date,
    dateDisplay: {
      en: enMeta.dateDisplay,
      zh: zhMeta.dateDisplay,
    },
    title: {
      en: enMeta.title,
      zh: zhMeta.title,
    },
    dek: {
      en: enMeta.dek,
      zh: zhMeta.dek,
    },
    leafTitle: {
      en: buildLeafTitle(enMeta.title, enMeta.leafEmphasis),
      zh: buildLeafTitle(zhMeta.title, zhMeta.leafEmphasis),
    },
    entryTitle: {
      en: buildEntryTitle(enMeta.title, enMeta.titleEmphasis, "en"),
      zh: buildEntryTitle(zhMeta.title, zhMeta.titleEmphasis, "zh"),
    },
    metaDescription: enMeta.metaDescription ?? "",
    author: enMeta.author,
  };
}

export const journalEntries: JournalEntryMeta[] = getJournalSlugs()
  .map((slug) => buildEntry(slug))
  .sort((a, b) => b.date.localeCompare(a.date));

export function getEntryBySlug(slug: string): JournalEntryMeta | undefined {
  return journalEntries.find((entry) => entry.slug === slug);
}
