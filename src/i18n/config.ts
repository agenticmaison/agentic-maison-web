/**
 * i18n configuration — locale constants shared across proxy, layout, and
 * components. Keep this module dependency-free so the proxy can import it
 * without pulling in React or server-only packages.
 */

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Cookie name used to persist the user's language preference. */
export const localeCookie = 'am-lang';

/** Map short locale codes to BCP 47 / HTML lang values. */
export function htmlLang(locale: Locale): string {
  return locale === 'zh' ? 'zh-HK' : 'en';
}

/** Check whether a string is one of our supported locale codes. */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
