import type { MetadataRoute } from "next";
import { journalEntries } from "@/lib/journal/entries";
import { locales } from "@/i18n/config";

const SITE = "https://agenticmaison.com";

/**
 * Sitemap with both locale variants and hreflang alternates.
 * Each page emits one entry per locale, with alternates.languages
 * linking the EN <-> ZH counterparts.
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
        "zh-Hant": `${SITE}/zh${path}`,
      },
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = [
    ...localeEntry("/", { lastModified: now, changeFrequency: "weekly", priority: 1.0 }),
    ...localeEntry("/services/ai", { lastModified: now, changeFrequency: "monthly", priority: 0.6 }),
    ...localeEntry("/services/digital", { lastModified: now, changeFrequency: "monthly", priority: 0.6 }),
    ...localeEntry("/digital", { lastModified: now, changeFrequency: "monthly", priority: 0.5 }),
  ];

  const journal = journalEntries.flatMap((entry) =>
    localeEntry(`/journal/${entry.slug}`, {
      lastModified: new Date(entry.date),
      changeFrequency: "yearly",
      priority: 0.7,
    })
  );

  return [...pages, ...journal];
}
