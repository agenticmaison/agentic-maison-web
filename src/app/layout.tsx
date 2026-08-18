import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Source_Serif_4, JetBrains_Mono, Noto_Serif_TC } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { headers } from "next/headers";
import { htmlLang, type Locale } from "@/i18n/config";
import { siteDefaultMetadata } from "@/lib/metadata/page-metadata";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  weight: ["300", "400", "500"],
  preload: false,
  display: "swap",
});

/**
 * Site-wide defaults, including the Open Graph card every route falls back to.
 * Composed in `src/lib/metadata/page-metadata.ts` rather than written out here,
 * so that no file under `src/app/` contains an `openGraph` object — see that
 * module's header for why a hand-written one is a hazard.
 */
export const metadata: Metadata = siteDefaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#efe8d6" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0d0a" },
  ],
};

// Pre-hydration boot script — sets data-theme on <html> before React mounts,
// avoiding FOUC. Lang is now authoritative from the URL (set server-side via
// the x-locale proxy header), so the boot script only handles theme.
const bootScript = `(function () {
  var root = document.documentElement;
  try {
    var stored = localStorage.getItem('am-theme');
    var t = (stored === 'dark' || stored === 'light') ? stored : 'dark';
    root.setAttribute('data-theme', t);
  } catch (e) { root.setAttribute('data-theme', 'dark'); }
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the locale forwarded by the proxy via request header.
  // Falls back to 'en' for non-locale routes (e.g. /deck).
  const headerStore = await headers();
  const locale = (headerStore.get('x-locale') || 'en') as Locale;

  return (
    <html
      lang={htmlLang(locale)}
      data-theme="dark"
      data-lang={locale}
      suppressHydrationWarning
      className={`${cormorant.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} ${notoSerifTC.variable}`}
    >
      <head>
        <Script id="am-boot" strategy="beforeInteractive">
          {bootScript}
        </Script>
        <link
          rel="preload"
          as="image"
          href="/assets/mechanism/center-wheel.png"
          fetchPriority="high"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
