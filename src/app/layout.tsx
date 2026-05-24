import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Source_Serif_4, JetBrains_Mono, Noto_Serif_TC } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { headers } from "next/headers";
import { htmlLang, type Locale } from "@/i18n/config";
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
  applicationName: "Agentic Maison",
  authors: [{ name: "Agentic Maison" }],
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

// Pre-hydration boot script — sets data-theme on <html> before React mounts,
// avoiding FOUC. Lang is now authoritative from the URL (set server-side via
// the x-locale proxy header), so the boot script only handles theme.
const bootScript = `(function () {
  var root = document.documentElement;
  try {
    var t = localStorage.getItem('am-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    root.setAttribute('data-theme', t);
  } catch (e) { root.setAttribute('data-theme', 'light'); }
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
      data-theme="light"
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
