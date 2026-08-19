import type { MetadataRoute } from "next";
import { journalEntries } from "@/lib/journal/entries";
import { locales } from "@/i18n/config";

const SITE = "https://agenticmaison.com";

/**
 * Sitemap with both locale variants and hreflang alternates.
 * Each page emits one entry per locale, with alternates.languages
 * linking the EN <-> ZH counterparts.
 *
 * A journal entry with no `index.zh.md` is the exception, and `englishOnly()`
 * below is where it is handled: its `/zh/` URL serves the English article and
 * canonicalises to the `/en/` one, so listing it here would be advertising a
 * URL the site itself says is not canonical. It gets one row and no alternates
 * — a one-language hreflang cluster is not a cluster.
 */

function localeEntry(
  path: string,
  opts: { lastModified: Date; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${SITE}/${locale}${path}`,
    lastModified: opts.lastModified,
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: {
      languages: {
        en: `${SITE}/en${path}`,
        "zh-HK": `${SITE}/zh${path}`,
        "x-default": `${SITE}/en${path}`,
      },
    },
  }));
}

/** The `/en/` row alone, for a page that exists in English only. */
function englishOnly(
  path: string,
  opts: { lastModified: Date; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }
): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE}/en${path}`,
      lastModified: opts.lastModified,
      changeFrequency: opts.changeFrequency,
      priority: opts.priority,
    },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = [
    ...localeEntry("", { lastModified: now, changeFrequency: "weekly", priority: 1.0 }),
    // ...localeEntry("/services/ai", { lastModified: now, changeFrequency: "monthly", priority: 0.6 }),
    // ...localeEntry("/services/digital", { lastModified: now, changeFrequency: "monthly", priority: 0.6 }),
    ...localeEntry("/digital", { lastModified: now, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntry("/journal", { lastModified: now, changeFrequency: "weekly", priority: 0.8 }),
  ];

  const journal = journalEntries.flatMap((entry) =>
    (entry.hasZh ? localeEntry : englishOnly)(`/journal/${entry.slug}`, {
      lastModified: new Date(entry.date),
      changeFrequency: "yearly",
      priority: 0.7,
    })
  );

  return [...pages, ...journal];
}
