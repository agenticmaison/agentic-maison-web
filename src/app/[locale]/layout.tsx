import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, isLocale, htmlLang, type Locale } from '@/i18n/config';

/**
 * [locale] segment layout — validates the locale param and provides
 * locale-specific metadata (title, description, alternates).
 *
 * generateStaticParams tells Next.js to pre-render for both locales.
 */

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const titles: Record<Locale, string> = {
    en: 'Agentic Maison — Run your business with AI agents.',
    zh: 'Agentic Maison — 用 AI 智能體經營你的業務。',
  };

  const descriptions: Record<Locale, string> = {
    en: 'Agentic Maison builds maisons of specialist AI agents that operate the disciplines of a business — sales, operations, support, performance, marketing — as a single instrument.',
    zh: 'Agentic Maison 打造專業 AI 智能體工坊，將業務的各個領域 — 銷售、營運、支援、績效、行銷 — 當作一具樂器來操作。',
  };

  return {
    title: {
      default: titles[locale],
      template: '%s · Agentic Maison',
    },
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        'zh-HK': '/zh',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_HK' : 'en_US',
      url: `https://agenticmaison.com/${locale}`,
      siteName: 'Agentic Maison',
      title: titles[locale],
      images: [
        {
          url: `https://agenticmaison.com/og.png`,
          width: 1200,
          height: 630,
          alt: 'Agentic Maison',
        },
      ],
      description:
        locale === 'zh'
          ? '專業 AI 智能體工坊，將業務的各個領域當作一具樂器來操作。'
          : 'Maisons of specialist AI agents that operate the disciplines of a business as a single instrument.',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale],
      description:
        locale === 'zh'
          ? '專業 AI 智能體工坊，將業務的各個領域當作一具樂器來操作。'
          : 'Maisons of specialist AI agents that operate the disciplines of a business as a single instrument.',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <>{children}</>;
}
