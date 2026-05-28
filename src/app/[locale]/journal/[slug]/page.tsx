import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SheetShell } from '@/components/sheet-shell';
import { JournalAuthor } from '@/components/journal-author';
import { JournalToc } from '@/components/journal-toc';
import { getEntryBySlug, journalEntries } from '@/lib/journal/entries';
import { getAuthor } from '@/lib/journal/authors';
import {
  assertMdxRegistryComplete,
  extractHeadings,
  getFaqJsonLd,
  getRawMdxContent,
} from '@/lib/journal/mdx';
import { locales, isLocale, type Locale } from '@/i18n/config';
import { localePath } from '@/i18n/paths';

/**
 * /[locale]/journal/[slug] — dynamic journal entry route.
 *
 * MDX-powered: body content lives in src/content/journal/<slug>/en.mdx
 * and zh.mdx. Now renders only the active locale's MDX file.
 */

// Generate all locale x slug combinations for static rendering
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    journalEntries.map((entry) => ({
      locale,
      slug: entry.slug,
    }))
  );
}

export const dynamicParams = false;

// Registry of MDX content imports keyed by slug.
// Next.js requires statically analyzable imports for MDX React components.
const mdxContentMap: Record<
  string,
  {
    en: () => Promise<{ default: React.ComponentType }>;
    zh: () => Promise<{ default: React.ComponentType }>;
  }
> = {
  'why-most-ai-projects-fail': {
    en: () => import('@/content/journal/why-most-ai-projects-fail/en.mdx'),
    zh: () => import('@/content/journal/why-most-ai-projects-fail/zh.mdx'),
  },
  'ai-automation-guide-small-business': {
    en: () =>
      import('@/content/journal/ai-automation-guide-small-business/en.mdx'),
    zh: () =>
      import('@/content/journal/ai-automation-guide-small-business/zh.mdx'),
  },
  'what-is-an-ai-agent': {
    en: () => import('@/content/journal/what-is-an-ai-agent/en.mdx'),
    zh: () => import('@/content/journal/what-is-an-ai-agent/zh.mdx'),
  },
  'ai-vs-automation-vs-ai-agents': {
    en: () => import('@/content/journal/ai-vs-automation-vs-ai-agents/en.mdx'),
    zh: () => import('@/content/journal/ai-vs-automation-vs-ai-agents/zh.mdx'),
  },
};

assertMdxRegistryComplete(
  journalEntries.map((entry) => entry.slug),
  mdxContentMap
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const entry = getEntryBySlug(slug);
  if (!entry) return {};

  const title = entry.title[locale];
  const description = locale === 'zh' ? entry.dek.zh : entry.metaDescription;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/journal/${slug}`,
      languages: {
        en: `/en/journal/${slug}`,
        'zh-HK': `/zh/journal/${slug}`,
      },
    },
    openGraph: {
      title: `${title} · Agentic Maison`,
      description,
      url: `https://agenticmaison.com/${locale}/journal/${slug}`,
      type: 'article',
      locale: locale === 'zh' ? 'zh_HK' : 'en_US',
      publishedTime: entry.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · Agentic Maison`,
      description,
    },
  };
}

const proseClasses =
  'font-body text-[clamp(1.05rem,1.18vw,1.18rem)] leading-[1.72] text-ink ' +
  '[&>p]:m-0 [&>p]:mb-[1.2em] [&>p:last-child]:mb-0 [&_em]:not-italic [&_em]:font-normal [&_em]:text-inherit ' +
  '[&_strong]:font-semibold [&_strong]:text-ink ' +
  '[&_a]:text-ink [&_a]:border-b [&_a]:border-ink [&_a]:pb-[1px] ' +
  '[&_a]:transition-colors [&_a]:duration-200 hover:[&_a]:text-brass hover:[&_a]:border-brass ' +
  // List styles — Tailwind preflight strips default ul/ol/li rendering
  '[&_ul]:list-disc [&_ul]:pl-[1.625em] [&_ul]:mb-[1.2em] ' +
  '[&_ol]:list-decimal [&_ol]:pl-[1.625em] [&_ol]:mb-[1.2em] ' +
  '[&_li]:mb-[0.35em] [&_li]:pl-[0.25em] ' +
  '[&_ul_ul]:mt-[0.35em] [&_ol_ol]:mt-[0.35em] [&_ul_ol]:mt-[0.35em] [&_ol_ul]:mt-[0.35em]';

const ruleClasses =
  'block w-[3rem] h-px bg-rule border-0 my-[clamp(2rem,3.5vw,2.75rem)]';

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;

  const entry = getEntryBySlug(slug);
  if (!entry) notFound();

  const author = getAuthor(entry.author);
  if (!author) notFound();

  // Load only the active locale's MDX content
  const contentImports = mdxContentMap[slug];
  if (!contentImports) {
    throw new Error(
      `Journal entry "${slug}" exists in content metadata but is missing from mdxContentMap. ` +
        'Add static MDX imports in src/app/[locale]/journal/[slug]/page.tsx.'
    );
  }

  const contentImport = contentImports[locale];
  // eslint-disable-next-line @next/next/no-assign-module-variable
  const module = await contentImport();
  const Content = module.default;

  // Extract headings from the active locale's content for the TOC
  const rawContent = getRawMdxContent(slug, locale);
  const tocHeadings = extractHeadings(rawContent);

  // FAQ JSON-LD — loaded from faq-<locale>.json when present
  const faqJsonLd = getFaqJsonLd(slug, locale);

  return (
    <SheetShell locale={locale}>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <main>
        <div className="journal-frame mx-auto w-fit max-w-full px-[clamp(1.5rem,3vw,3rem)] pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)]">
          {/* Top row: back-link + date */}
          <div className="flex items-baseline justify-between mb-[clamp(1.25rem,2vw,1.75rem)] max-w-[80ch] min-[1280px]:max-w-none">
            <Link
              href={localePath(locale, '/journal')}
              className="font-mono text-[0.74rem] tracking-[0.14em] uppercase text-ink pb-[4px] w-fit transition-colors duration-200 hover:text-brass hover:border-brass inline-block"
            >
              <span lang="en">&larr; Back to the journal</span>
              <span lang="zh">&larr; 返回札記</span>
            </Link>
            <span className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-ink-2">
              <span lang="en">{entry.dateDisplay.en}</span>
              <span lang="zh">{entry.dateDisplay.zh}</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-semibold text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.018em] m-0 text-ink [&_em]:not-italic [&_em]:text-inherit max-w-[80ch] min-[1280px]:max-w-none">
            <span lang="en">{entry.entryTitle.en}</span>
            <span lang="zh">{entry.entryTitle.zh}</span>
          </h1>

          {/* Grid: TOC + article */}
          <div className="grid grid-cols-1 min-[1280px]:grid-cols-[200px_1fr] min-[1280px]:gap-[2rem] mt-[clamp(2.5rem,2.5vw,2rem)]">
            <div className="hidden min-[1280px]:block">
              <JournalAuthor author={author} />
              <JournalToc headings={tocHeadings} />
            </div>

            <article className="w-full max-w-[80ch]">
              {/* Dek */}
              <p className="font-body italic text-[clamp(1.1rem,1.3vw,1.25rem)] leading-[1.55] text-ink-2 m-0">
                <span lang="en">{entry.dek.en}</span>
                <span lang="zh">{entry.dek.zh}</span>
              </p>

              <hr className={ruleClasses} aria-hidden="true" />

              {/* Body — only the active locale's MDX */}
              <div className={proseClasses}>
                <Content />
              </div>

              <hr className={ruleClasses} aria-hidden="true" />

              {/* CTA */}
              <p className="font-body text-[clamp(1.05rem,1.18vw,1.18rem)] leading-[1.7] text-ink m-0">
                <span lang="en">
                  Want to explore whether AI implementation makes sense for your
                  business?{' '}
                  <Link
                    href={localePath(locale, '/#contact')}
                    className="text-ink border-b border-ink pb-[1px] transition-colors duration-200 hover:text-brass hover:border-brass"
                  >
                    Begin a correspondence.
                  </Link>
                </span>
                <span lang="zh">
                  想知道 AI 實施對你的業務是否合適？{' '}
                  <Link
                    href={localePath(locale, '/#contact')}
                    className="text-ink border-b border-ink pb-[1px] transition-colors duration-200 hover:text-brass hover:border-brass"
                  >
                    展開一段書信往來。
                  </Link>
                </span>
              </p>
            </article>
          </div>
        </div>
      </main>
    </SheetShell>
  );
}
