/**
 * Every page's metadata is composed here, and nowhere else.
 *
 * ## The trap this module exists to close
 *
 * Next.js merges metadata across route segments **shallowly**. A page that
 * exports `openGraph` does not add to the parent's `openGraph` — it *replaces*
 * it, key for key. So a page setting `openGraph: { title: 'The Journal' }` to
 * get a nicer card headline silently discards the site's `openGraph.images`,
 * and ships a blank card. Nothing warns; the build passes and the page renders.
 * (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`,
 * "Merging → Overwriting fields".)
 *
 * `pageMetadata()` takes the fields a page actually varies — title,
 * description, path, card headline — and builds the whole `openGraph` /
 * `twitter` shape itself. A caller cannot express "openGraph without images",
 * because a caller never writes an `openGraph` object at all. The `openGraph`
 * key is additionally banned inside `src/app/**` by an ESLint rule, so the
 * helper cannot be bypassed by accident either.
 *
 * ## The one escape hatch, and why it is shaped this way
 *
 * A segment that ships its own `opengraph-image` file (journal entries do,
 * from `web-002`) must NOT receive `images` here, or the hand-written value
 * shadows the generated card. Such a segment passes `ogImage: 'generated'`.
 *
 * That case omits the `images` **key entirely** rather than setting it to
 * `undefined`. This is load-bearing, not style: Next decides whether to apply
 * a segment's `opengraph-image` file with
 * `source.openGraph.hasOwnProperty('images')`
 * (`node_modules/next/dist/lib/metadata/resolve-metadata.js`, `mergeStaticMetadata`).
 * `{ images: undefined }` owns the property and would suppress the generated
 * card. `page-metadata.test.ts` asserts the key is absent.
 *
 * `twitter.images` is deliberately never set: Next fills `twitter:image` from
 * `openGraph.images` whenever `twitter` has no `images` key of its own
 * (`postProcessMetadata` in the same file), which keeps the two in step for
 * both the site card and the generated ones.
 */

import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';

export const SITE_URL = 'https://agenticmaison.com';
export const SITE_NAME = 'Agentic Maison';

/**
 * The site-wide card. `public/og.png`, absolute — Open Graph consumers do not
 * resolve relative URLs, and `metadataBase` only guarantees absolute output for
 * values Next itself resolves.
 */
export const SITE_OG_IMAGE = {
  url: `${SITE_URL}/og.png`,
  width: 1200,
  height: 630,
  alt: SITE_NAME,
} as const;

/** `og:locale` values. Distinct from `htmlLang` — Open Graph wants underscores. */
const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  zh: 'zh_HK',
};

/**
 * Site-wide defaults, applied once at the root layout.
 *
 * This is what gives `/deck`, the unlock gate and the 404 page a card: they sit
 * outside `[locale]` and never call `pageMetadata()`, so the root is their only
 * source of an image.
 */
export const siteDefaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export interface PageMetadataInput {
  locale: Locale;
  /**
   * Path after the locale prefix, with a leading slash — `'/journal'`.
   * The empty string is the locale root. Drives `canonical`, the `languages`
   * alternates and `og:url` together, so they cannot drift apart.
   */
  path?: string;
  /** `<title>`. The object form declares the template child pages inherit. */
  title: string | { default: string; template: string };
  /** `<meta name="description">`. */
  description: string;
  /** Card headline, when it should differ from `title`. */
  ogTitle?: string;
  /** Card body, when it should differ from `description`. */
  ogDescription?: string;
  ogType?: 'website' | 'article';
  /** ISO date, for `ogType: 'article'`. */
  publishedTime?: string;
  /**
   * Where the card image comes from.
   *
   * - `'site'` (default) — `public/og.png`.
   * - `'generated'` — this segment ships its own `opengraph-image` file and
   *   Next wires the image tags itself. Only legal in a directory that has one;
   *   `page-metadata.test.ts` enforces that.
   */
  ogImage?: 'site' | 'generated';
}

export function pageMetadata(input: PageMetadataInput): Metadata {
  const {
    locale,
    path = '',
    title,
    description,
    ogTitle,
    ogDescription,
    ogType = 'website',
    publishedTime,
    ogImage = 'site',
  } = input;

  const plainTitle = typeof title === 'string' ? title : title.default;
  const cardTitle = ogTitle ?? plainTitle;
  const cardDescription = ogDescription ?? description;

  const card = {
    locale: OG_LOCALE[locale],
    url: `${SITE_URL}/${locale}${path}`,
    siteName: SITE_NAME,
    title: cardTitle,
    description: cardDescription,
    // See the module header: for a generated card the key must be absent,
    // not `undefined`.
    ...(ogImage === 'generated' ? {} : { images: [SITE_OG_IMAGE] }),
  };

  // Split rather than `type: ogType` — `OpenGraph` is a discriminated union and
  // `publishedTime` only exists on the article arm.
  const openGraph: Metadata['openGraph'] =
    ogType === 'article'
      ? {
          ...card,
          type: 'article',
          ...(publishedTime ? { publishedTime } : {}),
        }
      : { ...card, type: 'website' };

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        en: `/en${path}`,
        'zh-HK': `/zh${path}`,
      },
    },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: cardTitle,
      description: cardDescription,
    },
  };
}
