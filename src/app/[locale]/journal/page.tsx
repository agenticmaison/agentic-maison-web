import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SheetShell } from '@/components/sheet-shell';
import { journalEntries } from '@/lib/journal/entries';
import { locales, isLocale, type Locale } from '@/i18n/config';
import { localePath } from '@/i18n/paths';

/**
 * /[locale]/journal — journal index page.
 *
 * Lists all journal entries newest-first. Each entry shows title, date,
 * dek (summary), and author name, linking to the full entry page.
 */

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const titles: Record<Locale, string> = {
    en: 'The Journal',
    zh: '札記',
  };

  const descriptions: Record<Locale, string> = {
    en: 'Notes on AI implementation, agent architecture, and the operational work that builds around them. From the atelier of Agentic Maison.',
    zh: '關於 AI 實施、智能體架構，以及圍繞它們構建的營運工作的札記。來自 Agentic Maison 工坊。',
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}/journal`,
      languages: {
        en: '/en/journal',
        'zh-HK': '/zh/journal',
      },
    },
    openGraph: {
      title: `${titles[locale]} · Agentic Maison`,
      description: descriptions[locale],
      url: `https://agenticmaison.com/${locale}/journal`,
      type: 'website',
      locale: locale === 'zh' ? 'zh_HK' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${titles[locale]} · Agentic Maison`,
      description: descriptions[locale],
    },
  };
}

export default async function JournalIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;

  return (
    <SheetShell locale={locale}>
      <main>
        <div className="mx-auto max-w-full px-[clamp(1.5rem,3vw,3rem)] pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)]">
          {/* Section heading */}
          <span className="section-index">
            <span lang="en">Notes from the atelier</span>
            <span lang="zh">來自工坊的札記</span>
          </span>
          <h1 className="section-h2 text-ink mb-[clamp(2rem,4vw,3rem)]">
            <span lang="en">
              The <em>Journal</em>.
            </span>
            <span lang="zh">
              <em>札記</em>。
            </span>
          </h1>

          {/* Entry list */}
          <div className="border-t border-rule">
            {journalEntries.map((entry) => {
              return (
                <Link
                  key={entry.slug}
                  href={localePath(locale, `/journal/${entry.slug}`)}
                  className="group block border-b border-rule py-[clamp(1.5rem,2.5vw,2.25rem)] no-underline transition-colors duration-[250ms] hover:bg-paper-2 focus-visible:bg-paper-2 px-[clamp(0.5rem,1vw,1rem)]"
                >
                  {/* Date + author row */}
                  <div className="flex items-baseline gap-[1rem] mb-[0.5rem]">
                    <span className="font-mono text-[0.66rem] tracking-[0.16em] uppercase text-brass">
                      <span lang="en">{entry.dateDisplay.en}</span>
                      <span lang="zh">{entry.dateDisplay.zh}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-display font-semibold text-[clamp(1.35rem,2.5vw,2rem)] leading-[1.15] tracking-[-0.012em] m-0 text-ink group-hover:text-brass group-focus-visible:text-brass transition-colors duration-200">
                    <span lang="en">{entry.title.en}</span>
                    <span lang="zh">{entry.title.zh}</span>
                  </h2>

                  {/* Dek */}
                  <p className="font-body text-[clamp(0.95rem,1.1vw,1.08rem)] leading-[1.6] text-ink-2 m-0 mt-[0.45rem] max-w-[65ch]">
                    <span lang="en">{entry.dek.en}</span>
                    <span lang="zh">{entry.dek.zh}</span>
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </SheetShell>
  );
}
