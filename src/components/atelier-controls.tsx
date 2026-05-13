"use client";

import { useEffect } from "react";

/**
 * AtelierControls — single Client Component that wires up F's interactive
 * behaviors after hydration. Mirrors the inline `<script>` in F's index.html
 * verbatim, ported to a useEffect with proper cleanup.
 *
 * Hooks up to DOM rendered by the Server Component page so the initial paint
 * is fully static (no hydration mismatch) and search engines see the full
 * markup. The boot script in <head> (see app/layout.tsx) sets data-theme /
 * data-lang on <html> pre-hydration so there's no FOUC.
 *
 * Behaviors:
 *   • theme toggle  — [data-theme-btn] buttons, persisted to localStorage
 *   • lang toggle   — [data-lang-btn] buttons, persisted to localStorage
 *   • HKT clock     — [data-clock] elements, ticks every 1s
 *   • form date     — [data-form-date] / [data-form-date-zh]
 *   • signoff name  — [data-signoff-source] → [data-signoff-name(-zh)]
 *   • scroll progress — rAF-throttled scroll listener writing
 *                       --p-hero / --p-about on <html>
 *   • prefers-reduced-motion — skips scroll listener; locks state readout
 */
export function AtelierControls() {
  useEffect(() => {
    const root = document.documentElement;

    // --- theme ---
    const themeBtns = Array.from(
      document.querySelectorAll<HTMLButtonElement>("[data-theme-btn]")
    );
    const syncTheme = () => {
      const c = root.getAttribute("data-theme");
      themeBtns.forEach((b) => {
        b.setAttribute("aria-pressed", String(b.dataset.themeBtn === c));
      });
    };
    const themeHandlers = themeBtns.map((b) => {
      const handler = () => {
        const t = b.dataset.themeBtn;
        if (!t) return;
        root.setAttribute("data-theme", t);
        try { localStorage.setItem("am-theme", t); } catch {}
        syncTheme();
      };
      b.addEventListener("click", handler);
      return [b, handler] as const;
    });
    syncTheme();

    const mql = matchMedia("(prefers-color-scheme: dark)");
    const mqlHandler = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem("am-theme")) {
          root.setAttribute("data-theme", e.matches ? "dark" : "light");
          syncTheme();
        }
      } catch {}
    };
    try { mql.addEventListener("change", mqlHandler); } catch {}

    // --- lang ---
    const langBtns = Array.from(
      document.querySelectorAll<HTMLButtonElement>("[data-lang-btn]")
    );
    const syncLang = () => {
      const c = root.getAttribute("data-lang") || "en";
      langBtns.forEach((b) => {
        b.setAttribute("aria-pressed", String(b.dataset.langBtn === c));
      });
      root.setAttribute("lang", c === "zh" ? "zh-Hant" : "en");
    };
    const langHandlers = langBtns.map((b) => {
      const handler = () => {
        const l = b.dataset.langBtn;
        if (!l) return;
        root.setAttribute("data-lang", l);
        try { localStorage.setItem("am-lang", l); } catch {}
        syncLang();
      };
      b.addEventListener("click", handler);
      return [b, handler] as const;
    });
    syncLang();

    // --- HKT clock ---
    const clockEls = Array.from(document.querySelectorAll<HTMLElement>("[data-clock]"));
    const pad = (n: number) => (n < 10 ? "0" + n : "" + n);
    const tick = () => {
      const now = new Date();
      let s: string;
      try {
        s = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Hong_Kong",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);
      } catch {
        const hk = new Date(now.getTime() + (8 * 60 + now.getTimezoneOffset()) * 60000);
        s = pad(hk.getHours()) + ":" + pad(hk.getMinutes()) + ":" + pad(hk.getSeconds());
      }
      clockEls.forEach((el) => { el.textContent = s; });
    };
    tick();
    const tickInterval = window.setInterval(tick, 1000);

    // --- contact form date stamp ---
    try {
      const formDate = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Hong_Kong",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date());
      document.querySelectorAll<HTMLElement>("[data-form-date]").forEach((el) => {
        el.textContent = formDate;
      });
      const formDateZh = new Intl.DateTimeFormat("zh-Hant", {
        timeZone: "Asia/Hong_Kong",
        dateStyle: "long",
      }).format(new Date());
      document.querySelectorAll<HTMLElement>("[data-form-date-zh]").forEach((el) => {
        el.textContent = formDateZh;
      });
    } catch {}

    // --- dynamic signoff name ---
    const signoffSource = document.querySelector<HTMLInputElement>("[data-signoff-source]");
    const signoffEn = document.querySelector<HTMLElement>("[data-signoff-name]");
    const signoffZh = document.querySelector<HTMLElement>("[data-signoff-name-zh]");
    let signoffHandler: ((this: HTMLInputElement) => void) | null = null;
    if (signoffSource && signoffEn && signoffZh) {
      signoffHandler = function () {
        const v = signoffSource.value.trim();
        signoffEn.textContent = v || "your name";
        signoffZh.textContent = v || "您的署名";
      };
      signoffSource.addEventListener("input", signoffHandler);
    }

    // --- scroll-bound mechanism progress ---
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section]")
    );
    const stateEl = document.querySelector<HTMLElement>("[data-state]");
    const stateZhEl = document.querySelector<HTMLElement>("[data-state-zh]");
    const clamp = (v: number, lo: number, hi: number) =>
      Math.max(lo, Math.min(hi, v));

    const heroEl = document.querySelector<HTMLElement>('[data-section="hero"]');
    const aboutEl = document.querySelector<HTMLElement>('[data-section="about"]');

    const updateProgress = () => {
      if (reducedMotion) return;
      const vh = window.innerHeight;
      let pHero = 0;
      let pAbout = 0;
      sections.forEach((section) => {
        const key = section.dataset.section;
        if (!key) return;
        const rect = section.getBoundingClientRect();
        const total = rect.height + vh;
        const elapsed = vh - rect.top;
        const p = clamp(elapsed / total, 0, 1);
        root.style.setProperty("--p-" + key, p.toFixed(3));
        if (key === "hero") pHero = p;
        if (key === "about") pAbout = p;
      });

      // --p-overall — runway from "top of Hero touches viewport top" to
      // "bottom of About touches viewport bottom". Computed from the combined
      // hero+about bounding rect so the progress actually reaches 1.0 at
      // scroll-bottom (per-section progress stalls around 0.56). Drives the
      // F1 layered-PNG mechanism animation. Matches index-v3a.html.
      let pOverall = 0;
      if (heroEl && aboutEl) {
        const hr = heroEl.getBoundingClientRect();
        const ar = aboutEl.getBoundingClientRect();
        const runwayLength = (ar.bottom - hr.top) - vh;
        const elapsed = -hr.top;
        pOverall = clamp(elapsed / Math.max(runwayLength, 1), 0, 1);
      }
      root.style.setProperty("--p-overall", pOverall.toFixed(3));

      // State readout 0 → 4 across the combined Hero+About runway. Thresholds
      // match the layer fade-in windows in globals.css so the readout ticks
      // up as each worker appears.
      let state = 0;
      if (pOverall > 0.20) state = 1;
      if (pOverall > 0.40) state = 2;
      if (pOverall > 0.65) state = 3;
      if (pOverall > 0.85) state = 4;
      if (stateEl) stateEl.textContent = String(state);
      if (stateZhEl) stateZhEl.textContent = String(state);

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
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      updateProgress();
    } else {
      if (stateEl) stateEl.textContent = "—";
      if (stateZhEl) stateZhEl.textContent = "—";
    }

    return () => {
      themeHandlers.forEach(([b, h]) => b.removeEventListener("click", h));
      langHandlers.forEach(([b, h]) => b.removeEventListener("click", h));
      try { mql.removeEventListener("change", mqlHandler); } catch {}
      window.clearInterval(tickInterval);
      if (signoffSource && signoffHandler) {
        signoffSource.removeEventListener("input", signoffHandler);
      }
      if (!reducedMotion) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
  }, []);

  return null;
}
