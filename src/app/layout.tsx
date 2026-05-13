import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Source_Serif_4, JetBrains_Mono, Noto_Serif_TC } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://agenticmaison.com"),
  title: {
    default: "Agentic Maison — Run your business with AI agents.",
    template: "%s · Agentic Maison",
  },
  description:
    "Agentic Maison builds maisons of specialist AI agents that operate the disciplines of a business — sales, operations, support, performance, marketing — as a single instrument.",
  applicationName: "Agentic Maison",
  authors: [{ name: "Agentic Maison" }],
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      "zh-Hant": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://agenticmaison.com",
    siteName: "Agentic Maison",
    title: "Agentic Maison — Run your business with AI agents.",
    description:
      "Maisons of specialist AI agents that operate the disciplines of a business as a single instrument.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentic Maison — Run your business with AI agents.",
    description:
      "Maisons of specialist AI agents that operate the disciplines of a business as a single instrument.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#efe8d6" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0d0a" },
  ],
};

// Pre-hydration boot script — sets data-theme and data-lang on <html> before
// React mounts, avoiding FOUC. Mirrors F's inline <head> script verbatim.
const bootScript = `(function () {
  var root = document.documentElement;
  try {
    var t = localStorage.getItem('am-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    root.setAttribute('data-theme', t);
  } catch (e) { root.setAttribute('data-theme', 'light'); }
  try {
    var l = localStorage.getItem('am-lang') || 'en';
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l === 'zh' ? 'zh-Hant' : 'en');
  } catch (e) { root.setAttribute('data-lang', 'en'); }
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} ${notoSerifTC.variable}`}
    >
      <head>
        <Script id="am-boot" strategy="beforeInteractive">
          {bootScript}
        </Script>
        {/* Preload the F1 center wheel — it's the heaviest layer (~580kb) and
            the visible LCP candidate in the schematic pane. Worker layers
            ride the eager queue via <img loading="eager"> in the component. */}
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
