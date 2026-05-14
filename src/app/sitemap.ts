import type { MetadataRoute } from "next";
import { journalEntries } from "@/lib/journal/entries";

const SITE = "https://agenticmaison.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const journalEntryEntries: MetadataRoute.Sitemap = journalEntries.map(
    (entry) => ({
      url: `${SITE}/journal/${entry.slug}`,
      lastModified: new Date(entry.date),
      changeFrequency: "yearly",
      priority: 0.7,
    }),
  );
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE}/services/ai`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/services/digital`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...journalEntryEntries,
  ];
}
