import type { MetadataRoute } from "next";

const SITE = "https://agenticmaison.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE}/services/ai`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/services/digital`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
