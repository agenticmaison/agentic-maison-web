import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { pageMetadata } from '@/lib/metadata/page-metadata';
import { metadata as tourMetadata } from '@/lib/chateau/content';
import { ChateauTour } from './chateau-tour';
import './chateau.css';

/**
 * /chateau — the scroll-driven tour. English only for now; the `/zh/` URL
 * serves the same page and canonicalises to `/en/chateau`.
 *
 * Kept out of the index until it is promoted to `/` (gate 9). The robots
 * block below is the only per-page override; the card itself comes from
 * `pageMetadata()` as everywhere else.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    ...pageMetadata({
      locale,
      path: '/chateau',
      title: tourMetadata.title,
      description: tourMetadata.description,
      availableLocales: ['en'],
    }),
    robots: { index: false, follow: false },
  };
}

export default async function ChateauPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ChateauTour locale={locale} />;
}
