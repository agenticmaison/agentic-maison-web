'use client';

import { useEffect } from 'react';

/**
 * DeckControls — wires up the /deck route's interactive behaviors:
 *   - theme toggle  [data-theme-btn], persisted to localStorage am-theme
 *   - lang toggle   [data-lang-btn],  persisted to localStorage am-lang
 *   - present mode: P enters, Esc exits; arrow keys / space / PageUp/Down
 *                   / Home / End navigate; tap left/right thirds on touch
 *   - HUD counter   #ctr-current / #ctr-total
 *
 * Mirrors the mock's inline <script> verbatim, ported to a useEffect with
 * cleanup. Keeps the theme/lang behaviors aligned with the rest of the
 * site (both root layout's boot script and AtelierControls use the same
 * data-attribute scheme).
 *
 * The deck markup is server-rendered; this client component only attaches
 * handlers, so the static HTML is fully indexable (well, indexable behind
 * the proxy cookie gate — but no hydration mismatch).
 */
export function DeckControls() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const themeBtns = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[data-theme-btn]')
    );
    const syncTheme = () => {
      const c = root.getAttribute('data-theme');
      themeBtns.forEach((b) =>
        b.setAttribute('aria-pressed', String(b.dataset.themeBtn === c))
      );
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

    const langBtns = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[data-lang-btn]')
    );
    const syncLang = () => {
      const c = root.getAttribute('data-lang') || 'en';
      langBtns.forEach((b) =>
        b.setAttribute('aria-pressed', String(b.dataset.langBtn === c))
      );
      root.setAttribute('lang', c === 'zh' ? 'zh-HK' : 'en');
    };
    const langHandlers = langBtns.map((b) => {
      const handler = () => {
        const l = b.dataset.langBtn;
        if (!l) return;
        root.setAttribute('data-lang', l);
        try {
          localStorage.setItem('am-lang', l);
        } catch {}
        syncLang();
      };
      b.addEventListener('click', handler);
      return [b, handler] as const;
    });
    syncLang();

    // --- present mode ---
    // Exclude slides hidden via the HIDDEN_SLIDES set in page.tsx (rendered
    // with the Tailwind `!hidden` utility → display:none). Filtering on the
    // computed display is token-agnostic, so present-mode count + navigation
    // stay in sync with the static page numbering regardless of how a slide
    // is opted out.
    const slides = Array.from(
      document.querySelectorAll<HTMLElement>('[data-slide]')
    ).filter((s) => getComputedStyle(s).display !== 'none');
    const total = slides.length;
    const ctrTotal = document.getElementById('ctr-total');
    if (ctrTotal) ctrTotal.textContent = String(total);
    let current = 1;

    const gotoSlide = (n: number) => {
      current = Math.max(1, Math.min(total, n));
      // Navigate by position in the visible slides array, not by data-slide value.
      slides.forEach((s, i) =>
        s.classList.toggle('active', i + 1 === current)
      );
      const ctrEl = document.getElementById('ctr-current');
      if (ctrEl) ctrEl.textContent = String(current);
    };

    // Below 720px the deck reflows as a scrolling stack of cards; present
    // mode (absolutely-positioned 16:10 crossfade) is incompatible with
    // that reflow, so we treat it as a no-op on small viewports.
    const isMobileViewport = () => window.matchMedia('(max-width: 720px)').matches;

    const enterPresent = () => {
      if (isMobileViewport()) return;
      body.classList.add('deck-present');
      gotoSlide(current);
      if (root.requestFullscreen) {
        root.requestFullscreen().catch(() => {});
      }
    };
    const exitPresent = () => {
      body.classList.remove('deck-present');
      // In leave-behind mode every slide is visible (scrolling), so clear the
      // "only one active" state by marking all as active.
      slides.forEach((s) => s.classList.add('active'));
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };

    const presentBtn = document.querySelector<HTMLButtonElement>(
      '[data-present]'
    );
    const presentBtnHandler = () => enterPresent();
    presentBtn?.addEventListener('click', presentBtnHandler);

    const onKeydown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isFormField =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
      if (
        e.key === 'p' &&
        !body.classList.contains('deck-present') &&
        !isFormField
      ) {
        enterPresent();
        return;
      }
      if (!body.classList.contains('deck-present')) return;
      if (e.key === 'Escape') {
        exitPresent();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        gotoSlide(current + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        gotoSlide(current - 1);
      } else if (e.key === 'Home') {
        gotoSlide(1);
      } else if (e.key === 'End') {
        gotoSlide(total);
      }
    };
    document.addEventListener('keydown', onKeydown);

    const onClick = (e: MouseEvent) => {
      if (!body.classList.contains('deck-present')) return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest('button, a')) return;
      const x = e.clientX;
      if (x < window.innerWidth * 0.3) gotoSlide(current - 1);
      else gotoSlide(current + 1);
    };
    document.addEventListener('click', onClick);

    // Exit present mode if user manually exits fullscreen (Esc on macOS, etc.)
    const onFsChange = () => {
      if (
        !document.fullscreenElement &&
        body.classList.contains('deck-present')
      ) {
        body.classList.remove('deck-present');
        slides.forEach((s) => s.classList.add('active'));
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);

    // If the viewport shrinks below 720px while in present mode, exit
    // gracefully — the mobile reflow takes over.
    const mql = window.matchMedia('(max-width: 720px)');
    const onMqlChange = (ev: MediaQueryListEvent) => {
      if (ev.matches && body.classList.contains('deck-present')) {
        exitPresent();
      }
    };
    mql.addEventListener('change', onMqlChange);

    return () => {
      themeHandlers.forEach(([b, h]) => b.removeEventListener('click', h));
      langHandlers.forEach(([b, h]) => b.removeEventListener('click', h));
      presentBtn?.removeEventListener('click', presentBtnHandler);
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('click', onClick);
      document.removeEventListener('fullscreenchange', onFsChange);
      mql.removeEventListener('change', onMqlChange);
      body.classList.remove('deck-present');
    };
  }, []);

  return null;
}
