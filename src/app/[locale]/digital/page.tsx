import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SheetShell } from '@/components/sheet-shell';
import { isLocale, type Locale } from '@/i18n/config';
import { localePath } from '@/i18n/paths';
import { pageMetadata } from '@/lib/metadata/page-metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const titles: Record<Locale, string> = {
    en: 'Digital Practice — Coming Soon',
    zh: '數位實踐 — 即將推出',
  };
  const descriptions: Record<Locale, string> = {
    en: 'The Digital Practice at Agentic Maison. Bespoke web work designed in-house and built to endure. Coming soon.',
    zh: 'Agentic Maison 的數位實踐。內部設計、刻意構建、為持久而建。即將推出。',
  };

  return pageMetadata({
    locale,
    path: '/digital',
    title: titles[locale],
    description: descriptions[locale],
  });
}

export default async function DigitalPlaceholder({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;

  return (
    <SheetShell locale={locale}>
      <main className="min-h-[calc(100vh-var(--header-band-h))] grid content-center py-[clamp(3rem,8vw,6rem)] px-[clamp(1.5rem,3vw,3rem)] gap-[1.75rem] max-w-[56ch] mx-auto [scroll-margin-top:var(--header-band-h)]">
        <span className="font-mono text-[0.72rem] tracking-[0.16em] uppercase text-brass">
          <span lang="en">Digital Practice</span>
          <span lang="zh">數位實踐</span>
        </span>
        <h1 className="font-display font-semibold text-[clamp(2.5rem,5vw,4rem)] leading-[1.04] tracking-[-0.02em] m-0 [&_em]:italic [&_em]:text-brass">
          <span lang="en">
            Coming <em>soon</em>.
          </span>
          <span lang="zh">
            <em>即將</em>推出。
          </span>
        </h1>
        <p className="font-body text-[1.08rem] leading-[1.7] text-ink-2 m-0 max-w-[48ch]">
          <span lang="en">
            Bespoke digital experiences — custom websites, brand systems, and
            applications — designed in-house, built with intention, built to
            endure. The full plate is being drawn.
          </span>
          <span lang="zh">
            定制數位體驗——自訂網站、品牌系統和應用程式——內部設計、刻意構建、為持久而建。完整的圖版正在繪製中。
          </span>
        </p>
        <Link
          className="font-mono text-[0.74rem] tracking-[0.14em] uppercase text-ink border-b border-ink pb-[4px] w-fit transition-colors duration-200 hover:text-brass hover:border-brass"
          href={localePath(locale, '/')}
        >
          <span lang="en">&larr; Back to the maison</span>
          <span lang="zh">&larr; 返回工坊</span>
        </Link>
      </main>
    </SheetShell>
  );
}
