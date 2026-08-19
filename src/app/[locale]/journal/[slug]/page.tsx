import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SheetShell } from '@/components/sheet-shell';
import { Bilingual } from '@/components/bilingual';
import { JournalAuthor } from '@/components/journal-author';
import { JournalToc } from '@/components/journal-toc';
import { getEntryBySlug, journalEntries } from '@/lib/journal/entries';
import { getAuthor } from '@/lib/journal/authors';
import {
  compileJournalBody,
  getFaqJsonLd,
  sourceLocale,
} from '@/lib/journal/mdx';
import { proseComponents } from '@/lib/journal/prose-components';
import { locales, isLocale, type Locale } from '@/i18n/config';
import { localePath } from '@/i18n/paths';
import { pageMetadata } from '@/lib/metadata/page-metadata';

/**
 * /[locale]/journal/[slug] — dynamic journal entry route.
 *
 * Body content lives in src/content/journal/<slug>/index.en.md and, when the
 * entry is translated, index.zh.md, below YAML frontmatter. Only the served
 * locale's body is compiled and rendered. Nothing is registered by hand: adding
 * a folder with an index.en.md in it is enough to publish a post.
 *
 * An entry with no index.zh.md still has a /zh/ route and still renders — the
 * English article, marked `lang="en"`, under a short Chinese note saying so.
 * Both routes then canonicalise to the /en/ URL; see `generateMetadata` below.
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const entry = getEntryBySlug(slug);
  if (!entry) return {};

  // For an untranslated entry every `zh` field holds the English value, so the
  // zh route describes itself in English — which is what it is serving. One
  // description per locale, so there is nothing to choose between here.
  const title = entry.title[locale];
  const description = entry.description[locale];

  return pageMetadata({
    locale,
    path: `/journal/${slug}`,
    title,
    description,
    // An entry without index.zh.md exists in English only: both routes
    // canonicalise to /en/ and no zh-HK alternate is claimed for either.
    ...(entry.hasZh ? {} : { availableLocales: ['en' as const] }),
    ogTitle: `${title} · Agentic Maison`,
    ogType: 'article',
    publishedTime: entry.date,
    // This segment ships `opengraph-image.tsx` (web-002). Setting `images` here
    // — even to `undefined` — would shadow the generated card.
    ogImage: 'generated',
  });
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

  // Which file this page is actually made of: the requested locale, or English
  // where there is no translation. Everything below that is language-sensitive
  // — the body, the FAQ, the `lang` attributes — follows this, not the URL.
  const bodyLocale = sourceLocale(slug, locale);
  const isFallback = bodyLocale !== locale;

  // Compile only the served locale's body. The TOC comes out of the same pass,
  // reading the ids `rehype-slug` put on the headings this render emits.
  const { Content, headings: tocHeadings } = await compileJournalBody(
    slug,
    bodyLocale
  );

  // FAQ JSON-LD — built from the `faq` frontmatter list when present. Taken
  // from the file being rendered, so a fallback page's FAQPage quotes the
  // English questions the reader can actually see rather than nothing at all.
  const faqJsonLd = getFaqJsonLd(slug, bodyLocale);

  /** Marks an element as English content that must survive on the zh route. */
  const fallbackAttrs = isFallback
    ? ({ lang: 'en', 'data-en-fallback': '' } as const)
    : {};

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
        <div className="mx-auto max-w-full px-[clamp(1.5rem,3vw,3rem)] pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)]">
          <div className="journal-frame">
            {/* Top row: back-link + date */}
            <div className="flex items-baseline justify-between mb-[clamp(1.25rem,2vw,1.75rem)]">
              <Link
                href={localePath(locale, '/journal')}
                className="font-mono text-[0.74rem] tracking-[0.14em] uppercase text-ink pb-[4px] w-fit transition-colors duration-200 hover:text-brass hover:border-brass inline-block"
              >
                <span lang="en">&larr; Back to the journal</span>
                <span lang="zh">&larr; 返回札記</span>
              </Link>
              <span className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-ink-2">
                <Bilingual
                  en={entry.dateDisplay.en}
                  zh={entry.dateDisplay.zh}
                  fallback={isFallback}
                />
              </span>
            </div>

            {/* Untranslated entry, Chinese route: say so, once, plainly. */}
            {isFallback && (
              <p
                lang="zh"
                className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-brass m-0 mb-[0.75rem]"
              >
                本文只有英文版本。
              </p>
            )}

            {/* Title */}
            <h1 className="font-display font-semibold text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.018em] m-0 text-ink">
              <Bilingual
                en={entry.entryTitle.en}
                zh={entry.entryTitle.zh}
                fallback={isFallback}
              />
            </h1>

            {/* Grid: TOC + article */}
            <div className="grid grid-cols-1 min-[1280px]:grid-cols-[200px_1fr] min-[1280px]:gap-20 mt-[clamp(2.5rem,2.5vw,2rem)]">
              <div className="hidden min-[1280px]:block">
                <JournalAuthor author={author} />
                <JournalToc headings={tocHeadings} englishFallback={isFallback} />
              </div>

              <article className="w-full max-w-[80ch]">
                {/* Standfirst */}
                <p className="font-body italic text-[clamp(1.1rem,1.3vw,1.25rem)] leading-[1.55] text-ink-2 m-0">
                  <Bilingual
                    en={entry.description.en}
                    zh={entry.description.zh}
                    fallback={isFallback}
                  />
                </p>

                <hr className={ruleClasses} aria-hidden="true" />

                {/* Body — only the served locale's markdown */}
                <div {...fallbackAttrs} className={proseClasses}>
                  <Content components={proseComponents} />
                </div>

                <hr className={ruleClasses} aria-hidden="true" />

                {/* CTA */}
                <p className="font-body text-[clamp(1.05rem,1.18vw,1.18rem)] leading-[1.7] text-ink m-0">
                  <span lang="en">
                    Want to explore whether AI implementation makes sense for
                    your business?{' '}
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
        </div>
      </main>
    </SheetShell>
  );
}
