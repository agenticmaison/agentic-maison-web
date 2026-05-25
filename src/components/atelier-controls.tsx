'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { htmlLang, isLocale } from '@/i18n/config';

/**
 * AtelierControls — single Client Component that wires up interactive
 * behaviors after hydration.
 *
 * Behaviors:
 *   - theme toggle  — [data-theme-btn] buttons, persisted to localStorage
 *   - HKT clock     — [data-clock] elements, ticks every 1s
 *   - form date     — [data-form-date] / [data-form-date-zh]
 *   - signoff mirror — [data-signoff-source] → [data-signoff-name(-zh)]
 *   - scroll progress — rAF-throttled scroll listener writing
 *                       --p-hero / --p-about on <html>
 *
 * NOTE: Language toggle is no longer handled here — it now navigates via
 * URL (see LanguageToggle component). The [data-lang-btn] wiring has been
 * removed. data-lang is set server-side from the URL locale.
 */
export function AtelierControls() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const localeSegment = pathname.split('/')[1];

    if (!isLocale(localeSegment)) return;

    root.setAttribute('data-lang', localeSegment);
    root.setAttribute('lang', htmlLang(localeSegment));
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;

    // --- theme ---
    const themeBtns = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[data-theme-btn]')
    );
    const syncTheme = () => {
      const c = root.getAttribute('data-theme');
      themeBtns.forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.themeBtn === c));
      });
    };
    const themeHandlers = themeBtns.map((b) => {
      const handler = () => {
        const t = b.dataset.themeBtn;
        if (!t) return;
        root.setAttribute('data-theme', t);
        try {
          localStorage.setItem('am-theme', t);
        } catch {}
        syncTheme();
      };
      b.addEventListener('click', handler);
      return [b, handler] as const;
    });
    syncTheme();

    const mql = matchMedia('(prefers-color-scheme: dark)');
    const mqlHandler = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem('am-theme')) {
          root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
          syncTheme();
        }
      } catch {}
    };
    try {
      mql.addEventListener('change', mqlHandler);
    } catch {}

    // --- HKT clock ---
    const clockEls = Array.from(
      document.querySelectorAll<HTMLElement>('[data-clock]')
    );
    const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
    const tick = () => {
      const now = new Date();
      let s: string;
      try {
        s = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Hong_Kong',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now);
      } catch {
        const hk = new Date(
          now.getTime() + (8 * 60 + now.getTimezoneOffset()) * 60000
        );
        s =
          pad(hk.getHours()) +
          ':' +
          pad(hk.getMinutes()) +
          ':' +
          pad(hk.getSeconds());
      }
      clockEls.forEach((el) => {
        el.textContent = s;
      });
    };
    tick();
    const tickInterval = window.setInterval(tick, 1000);

    // --- contact form date stamp ---
    try {
      const formDate = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Hong_Kong',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date());
      document
        .querySelectorAll<HTMLElement>('[data-form-date]')
        .forEach((el) => {
          el.textContent = formDate;
        });
      const formDateZh = new Intl.DateTimeFormat('zh-Hant', {
        timeZone: 'Asia/Hong_Kong',
        dateStyle: 'long',
      }).format(new Date());
      document
        .querySelectorAll<HTMLElement>('[data-form-date-zh]')
        .forEach((el) => {
          el.textContent = formDateZh;
        });
    } catch {}

    // --- dynamic signoff (name + email mirror below "With thanks,") ---
    const signoffNameSource = document.querySelector<HTMLInputElement>(
      '[data-signoff-source]'
    );
    const signoffNameEn = document.querySelector<HTMLElement>(
      '[data-signoff-name]'
    );
    const signoffNameZh = document.querySelector<HTMLElement>(
      '[data-signoff-name-zh]'
    );
    let signoffHandler: (() => void) | null = null;
    if (signoffNameSource && signoffNameEn && signoffNameZh) {
      signoffHandler = function syncSignoff() {
        const n = signoffNameSource.value.trim();
        signoffNameEn.textContent = n || 'The Undersigned';
        signoffNameZh.textContent = n || '署名者';
      };
      signoffHandler();
      signoffNameSource.addEventListener('input', signoffHandler);
    }

    // --- scroll-bound mechanism progress ---
    const reducedMotion = matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-section]')
    );
    const clamp = (v: number, lo: number, hi: number) =>
      Math.max(lo, Math.min(hi, v));

    const heroEl = document.querySelector<HTMLElement>('[data-section="hero"]');
    const journalEl = document.querySelector<HTMLElement>(
      '[data-section="journal"]'
    );
    const mechRunwayEl =
      document.querySelector<HTMLElement>('[data-mech-runway]');
    const mobileMechMq = matchMedia('(max-width: 980px)');

    const updateProgress = () => {
      if (reducedMotion) return;
      const vh = window.innerHeight;
      sections.forEach((section) => {
        const key = section.dataset.section;
        if (!key) return;
        const rect = section.getBoundingClientRect();
        const total = rect.height + vh;
        const elapsed = vh - rect.top;
        const p = clamp(elapsed / total, 0, 1);
        root.style.setProperty('--p-' + key, p.toFixed(3));
      });

      const mobileMechRunwayShrink = 0.76;
      let pOverall = 0;
      if (mobileMechMq.matches && mechRunwayEl) {
        const r = mechRunwayEl.getBoundingClientRect();
        const total = r.height + vh;
        const elapsed = vh - r.top;
        pOverall = clamp(
          elapsed / Math.max(total * mobileMechRunwayShrink, 1),
          0,
          1
        );
      } else if (heroEl && journalEl) {
        // --p-overall spans the full runway from Hero through Journal
        // so the mechanism animation plays across the entire scrolling content.
        const hr = heroEl.getBoundingClientRect();
        const jr = journalEl.getBoundingClientRect();
        const runwayLength = jr.bottom - hr.top - vh;
        const elapsed = -hr.top;
        pOverall = clamp(elapsed / Math.max(runwayLength, 1), 0, 1);
      }
      root.style.setProperty('--p-overall', pOverall.toFixed(3));
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };
    if (!reducedMotion) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      updateProgress();
    }

    return () => {
      themeHandlers.forEach(([b, h]) => b.removeEventListener('click', h));
      try {
        mql.removeEventListener('change', mqlHandler);
      } catch {}
      window.clearInterval(tickInterval);
      if (signoffHandler) {
        signoffNameSource?.removeEventListener('input', signoffHandler);
      }
      if (!reducedMotion) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    };
  }, []);

  return null;
}
