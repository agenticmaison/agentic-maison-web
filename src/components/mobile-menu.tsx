'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * MobileMenu — hamburger trigger + fullscreen modal for mobile widths
 * (≤640px). The trigger cell only renders on mobile; the modal panel is
 * always mounted in the DOM (just visually toggled) so the theme/lang
 * buttons inside it are present on initial paint and AtelierControls'
 * useEffect can attach click handlers to them on mount.
 *
 * The duplicated `[data-theme-btn]` / `[data-lang-btn]` buttons are wired
 * up by the same delegated query in AtelierControls, so toggling here
 * stays in sync with the desktop toggles.
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

export function MobileMenu() {
  const [open, setOpen] = useState(false);

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

  // Direct DOM handlers for theme/lang — mirror what AtelierControls does
  // for the desktop toggles. Driving the DOM directly here means the
  // modal buttons work regardless of AtelierControls' mount-time wiring
  // order. AtelierControls' syncTheme/syncLang on the next user
  // interaction will catch up, but we also sync aria-pressed across all
  // matching buttons immediately so the desktop chrome stays in lockstep.
  const setTheme = (t: 'light' | 'dark') => {
    const root = document.documentElement;
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('am-theme', t); } catch {}
    document
      .querySelectorAll<HTMLButtonElement>('[data-theme-btn]')
      .forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.themeBtn === t));
      });
  };

  const setLang = (l: 'en' | 'zh') => {
    const root = document.documentElement;
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l === 'zh' ? 'zh-Hant' : 'en');
    try { localStorage.setItem('am-lang', l); } catch {}
    document
      .querySelectorAll<HTMLButtonElement>('[data-lang-btn]')
      .forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.langBtn === l));
      });
  };

  return (
    <>
      {/* Hamburger cell — slots into the titleblock grid as the second
          column on mobile. Hidden above 640px where the full titleblock
          is shown instead. */}
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

      {/* Modal — always mounted so duplicated toggle buttons are present
          when AtelierControls runs its mount-time query. Visibility is
          gated by pointer-events + opacity. */}
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
        {/* Backdrop — clicking closes. Dimmed so the underlying page
            shows through, signaling this is an overlay, not a screen. */}
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Close menu"
          onClick={close}
          className="absolute inset-0 w-full h-full bg-black/70 cursor-default"
        />

        {/* Panel — centered overlay (~360px wide, capped to viewport
            minus the 18px sheet inset on each side). No header bar; the
            close × floats in the panel's top-right corner. */}
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
                  data-lang-btn="en"
                  aria-pressed="false"
                  onClick={() => setLang('en')}
                >
                  EN
                </button>
                <span aria-hidden="true">/</span>
                <button
                  type="button"
                  className={toggleBtn}
                  data-lang-btn="zh"
                  aria-pressed="false"
                  onClick={() => setLang('zh')}
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
              <Link href="/#maison" onClick={close} className="nav-link">
                <span lang="en">The Maison</span>
                <span lang="zh">工坊</span>
              </Link>
              <Link href="/#contact" onClick={close} className="nav-link">
                <span lang="en">Contact</span>
                <span lang="zh">聯絡</span>
              </Link>
            </nav>

            <Link
              className="cta cta-compact self-start"
              href="/#contact"
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
