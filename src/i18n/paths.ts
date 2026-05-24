/**
 * Helper for building locale-prefixed paths.
 */
import type { Locale } from './config';

/** Prefix a path with the locale segment: localePath('en', '/journal/foo') → '/en/journal/foo' */
export function localePath(locale: Locale, path: string): string {
  // Ensure single leading slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${cleanPath}`;
}

/**
 * Given the current pathname and target locale, swap the locale prefix.
 * e.g. swapLocale('/en/journal/foo', 'zh') → '/zh/journal/foo'
 */
export function swapLocale(pathname: string, targetLocale: Locale): string {
  // Remove the leading locale segment: /en/foo → /foo
  const withoutLocale = pathname.replace(/^\/(en|zh)/, '') || '/';
  return `/${targetLocale}${withoutLocale}`;
}
