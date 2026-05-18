import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/deck", "/deck/"] }],
    sitemap: "https://agenticmaison.com/sitemap.xml",
    host: "https://agenticmaison.com",
  };
}
