'use client';

import { usePathname, useRouter } from 'next/navigation';
import { localeCookie, type Locale } from '@/i18n/config';
import { swapLocale } from '@/i18n/paths';

/**
 * LanguageToggle — navigates between /en/... and /zh/... via URL.
 * Sets the am-lang cookie so the proxy remembers the preference.
 */

const toggleBtn =
  'appearance-none bg-transparent border-0 text-ink-3 [font:inherit] uppercase ' +
  'px-[0.15rem] cursor-pointer transition-colors duration-200 ' +
  'hover:text-brass ' +
  'aria-pressed:text-ink aria-pressed:border-b aria-pressed:border-brass aria-pressed:pb-px';

const toggleGroup =
  'inline-flex gap-[0.35rem] items-center font-mono text-[0.74rem] uppercase tracking-[0.14em] text-ink-3';

export function LanguageToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (target: Locale) => {
    if (target === locale) return;
    // Set cookie so proxy remembers preference
    document.cookie = `${localeCookie}=${target};path=/;max-age=31536000;SameSite=Lax`;
    const newPath = swapLocale(pathname, target);
    router.push(newPath);
  };

  return (
    <span className={toggleGroup} role="group" aria-label="Language">
      <button
        type="button"
        className={toggleBtn}
        aria-pressed={locale === 'en'}
        onClick={() => switchTo('en')}
      >
        EN
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        className={toggleBtn}
        aria-pressed={locale === 'zh'}
        onClick={() => switchTo('zh')}
      >
        中文
      </button>
    </span>
  );
}
