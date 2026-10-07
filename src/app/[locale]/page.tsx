import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { pageMetadata } from '@/lib/metadata/page-metadata';
import { metadata as tourMetadata } from '@/lib/chateau/content';
import { ChateauTour } from './chateau/chateau-tour';
import './chateau/chateau.css';

/** The homepage tour is English-only; both locale URLs canonicalise to /en. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({
    locale,
    title: tourMetadata.title,
    description: tourMetadata.description,
    availableLocales: ['en'],
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ChateauTour locale={locale} />;
}
