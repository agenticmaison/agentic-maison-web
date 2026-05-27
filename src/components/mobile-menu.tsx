'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { localeCookie, type Locale } from '@/i18n/config';
import { localePath, swapLocale } from '@/i18n/paths';

/**
 * MobileMenu — hamburger trigger + fullscreen modal for mobile widths
 * (<=640px). Language toggle now navigates via URL (same as desktop).
 */
const toggleBtn =
  'appearance-none bg-transparent border-0 text-ink-3 [font:inherit] uppercase ' +
  'px-[0.15rem] cursor-pointer transition-colors duration-200 ' +
  'hover:text-brass ' +
  'aria-pressed:text-ink aria-pressed:border-b aria-pressed:border-brass aria-pressed:pb-px';

const toggleGroup =
  'inline-flex gap-[0.45rem] items-center font-mono text-[0.95rem] uppercase tracking-[0.14em] text-ink-3';

const fieldLabel =
  'font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-3 mb-[10px]';

export function MobileMenu({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Lock body scroll + ESC-to-close when modal is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  // Theme toggle — DOM-direct (same as before, no i18n change needed)
  const setTheme = (t: 'light' | 'dark') => {
    const root = document.documentElement;
    root.setAttribute('data-theme', t);
    try {
      localStorage.setItem('am-theme', t);
    } catch {}
    document
      .querySelectorAll<HTMLButtonElement>('[data-theme-btn]')
      .forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.themeBtn === t));
      });
  };

  // Language toggle — navigate via URL
  const switchLang = (target: Locale) => {
    if (target === locale) return;
    document.cookie = `${localeCookie}=${target};path=/;max-age=31536000;SameSite=Lax`;
    const newPath = swapLocale(pathname, target);
    close();
    router.push(newPath);
  };

  return (
    <>
      {/* Hamburger cell */}
      <div className="hidden max-[640px]:flex items-center justify-end pl-[16px] pr-[calc(16px+var(--sheet-frame-inset,0px))] py-[12px]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu-panel"
          className="appearance-none bg-transparent shadow-none border-rule p-[10px] cursor-pointer text-ink hover:text-brass hover:border-brass transition-colors"
        >
          <span className="block w-[20px] h-[14px] relative" aria-hidden="true">
            <span className="absolute left-0 top-0 w-full h-0.5 bg-current" />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-current" />
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-current" />
          </span>
        </button>
      </div>

      {/* Modal */}
      <div
        id="mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        className={
          'fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ' +
          (open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none')
        }
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Close menu"
          onClick={close}
          className="absolute inset-0 w-full h-full bg-black/70 cursor-default"
        />

        <div className="relative w-[min(calc(100vw-36px),360px)] max-h-[calc(100vh-36px)] bg-paper border border-rule flex flex-col overflow-y-auto">
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="absolute top-[8px] right-[12px] appearance-none bg-transparent border-0 text-ink-3 hover:text-brass cursor-pointer text-[1.5rem] leading-none p-[4px]"
          >
            <span aria-hidden="true">×</span>
          </button>

          <div className="flex flex-col gap-[28px] p-[24px] pt-[44px]">
            {/* Theme */}
            <div>
              <div className={fieldLabel}>
                <span lang="en">Theme</span>
                <span lang="zh">主題</span>
              </div>
              <span className={toggleGroup} role="group" aria-label="Theme">
                <button
                  type="button"
                  className={toggleBtn}
                  data-theme-btn="light"
                  aria-pressed="false"
                  onClick={() => setTheme('light')}
                >
                  <span lang="en">Light</span>
                  <span lang="zh">淺</span>
                </button>
                <span aria-hidden="true">/</span>
                <button
                  type="button"
                  className={toggleBtn}
                  data-theme-btn="dark"
                  aria-pressed="false"
                  onClick={() => setTheme('dark')}
                >
                  <span lang="en">Dark</span>
                  <span lang="zh">深</span>
                </button>
              </span>
            </div>

            {/* Language */}
            <div>
              <div className={fieldLabel}>
                <span lang="en">Language</span>
                <span lang="zh">語言</span>
              </div>
              <span className={toggleGroup} role="group" aria-label="Language">
                <button
                  type="button"
                  className={toggleBtn}
                  aria-pressed={locale === 'en'}
                  onClick={() => switchLang('en')}
                >
                  EN
                </button>
                <span aria-hidden="true">/</span>
                <button
                  type="button"
                  className={toggleBtn}
                  aria-pressed={locale === 'zh'}
                  onClick={() => switchLang('zh')}
                >
                  中文
                </button>
              </span>
            </div>

            {/* Nav links */}
            <nav
              aria-label="Mobile primary"
              className="flex flex-col gap-[18px] border-t border-rule pt-[24px] font-mono text-[0.95rem] uppercase tracking-[0.14em]"
            >
              <Link
                href={localePath(locale, '/#maison')}
                onClick={close}
                className="nav-link"
              >
                <span lang="en">The Maison</span>
                <span lang="zh">工坊</span>
              </Link>
              <Link
                href={localePath(locale, '/#process')}
                onClick={close}
                className="nav-link"
              >
                <span lang="en">The Process</span>
                <span lang="zh">過程</span>
              </Link>
              <Link
                href={localePath(locale, '/#journal')}
                onClick={close}
                className="nav-link"
              >
                <span lang="en">The Journal</span>
                <span lang="zh">札記</span>
              </Link>
            </nav>

            <Link
              className="cta cta-compact self-start"
              href={localePath(locale, '/#contact')}
              onClick={close}
            >
              <span lang="en">Commission →</span>
              <span lang="zh">委託 →</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
