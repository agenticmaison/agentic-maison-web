import Link from 'next/link';
import { AtelierControls } from './atelier-controls';
import { MobileMenu } from './mobile-menu';

/**
 * SheetShell — drawing-sheet frame, sticky header band, and footer.
 * Used by the landing page and the stub subpages so they share the same
 * chrome. The page-specific content is rendered as `children`.
 *
 * The pre-hydration boot script in <head> (app/layout.tsx) sets data-theme
 * and data-lang on <html> before this renders, so the toggle aria-pressed
 * state is initialized correctly by <AtelierControls /> on mount.
 *
 * Header/nav strings are rendered as both <span lang="en"> and
 * <span lang="zh"> — globals.css toggles visibility via [data-lang] on <html>.
 *
 * Styling note: the `.sheet` class (in globals.css) defines a
 * `--sheet-frame-inset` CSS var and a `::before` inner frame; titleblock
 * cell paddings read that var to align under the drawn frame.
 */

// Shared per-cell styles for the titleblock grid (always 4-col single row).
const cellBase = 'flex flex-col justify-center min-h-[64px]';

// Standard (non-brand) cell — pl/pr 20/16, pt accounts for sheet frame inset, pb 12
const cellStandard =
  cellBase +
  ' pt-[calc(12px+var(--sheet-frame-inset,0px))] pb-[12px] pl-[20px] pr-[16px]';

// Brand cell — px 16, pt 14 + frame inset, pb 14
const cellBrand =
  cellBase +
  ' pt-[calc(14px+var(--sheet-frame-inset,0px))] pb-[14px] px-[16px]';

// Shadow recipes — right border only; last cell has no right border
const shadowOdd = 'shadow-[inset_-1px_0_0_0_var(--rule)]';
const shadowEven = 'shadow-[inset_-1px_0_0_0_var(--rule)]';
const shadowLast = 'shadow-none';

// Theme/lang toggle buttons share this — `[font:inherit]` re-inherits font
// shorthand (browser default for <button> would reset font-family/size).
const toggleBtn =
  'appearance-none bg-transparent border-0 text-ink-3 [font:inherit] uppercase ' +
  'px-[0.15rem] cursor-pointer transition-colors duration-200 ' +
  'hover:text-brass ' +
  'aria-pressed:text-ink aria-pressed:border-b aria-pressed:border-brass aria-pressed:pb-px';

const toggleGroup =
  'inline-flex gap-[0.35rem] items-center font-mono text-[0.74rem] uppercase tracking-[0.14em] text-ink-3';

export function SheetShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="sheet m-[18px] border border-rule">
      <span className="reg bl" /> <span className="reg br" />
      {/*
        Sticky top frame: wraps reg crosshairs (top corners) + titleblock + nav
        into ONE sticky element so the whole visual page frame stays pinned
        when scrolling. The bar redraws the sheet's outer border and inner
        ::before frame at its own top edge via ::before/::after, so the frame
        appears unbroken as content scrolls under it. Without this wrapping,
        the sheet's border + ::before scroll away (they belong to .sheet which
        is not sticky), leaving the hero text visible above the panel.
      */}
      <div className="sheet-top-bar" role="presentation">
        <span className="reg tl" /> <span className="reg tr" />
        <div
          className={
            'grid grid-cols-[2.4fr_1fr_1fr_1fr] max-[640px]:grid-cols-[1fr_auto] ' +
            'font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-2 bg-paper ' +
            'shadow-[inset_0_-1px_0_0_var(--rule)]'
          }
          role="group"
          aria-label="Atelier control panel"
        >
          <div className={`${cellBrand} ${shadowOdd}`}>
            <Link href="/">
              <span className="inline-flex items-baseline gap-[0.55rem] font-display italic font-normal text-[1.15rem] tracking-[-0.005em] text-ink">
                <b className="not-italic font-medium">Agentic</b>
                <span
                  className="inline-block w-[6px] h-[6px] bg-brass rotate-45 self-center"
                  aria-hidden="true"
                />
                <i>Maison</i>
              </span>
            </Link>
          </div>
          <div className={`${cellStandard} ${shadowEven} max-[640px]:hidden`}>
            <span className={toggleGroup} role="group" aria-label="Theme">
              <button
                type="button"
                className={toggleBtn}
                data-theme-btn="light"
                aria-pressed="false"
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
              >
                <span lang="en">Dark</span>
                <span lang="zh">深</span>
              </button>
            </span>
          </div>
          <div className={`${cellStandard} ${shadowOdd} max-[640px]:hidden`}>
            <span className={toggleGroup} role="group" aria-label="Language">
              <button
                type="button"
                className={toggleBtn}
                data-lang-btn="en"
                aria-pressed="false"
              >
                EN
              </button>
              <span aria-hidden="true">/</span>
              <button
                type="button"
                className={toggleBtn}
                data-lang-btn="zh"
                aria-pressed="false"
              >
                中文
              </button>
            </span>
          </div>
          <div className={`${cellStandard} ${shadowLast} max-[640px]:hidden`}>
            <span
              className="inline-flex items-center gap-[0.55rem] font-mono tabular-nums text-[0.74rem] tracking-[0.08em] text-ink"
              aria-live="off"
            >
              <span
                className="w-[6px] h-[6px] rounded-full bg-status-open shadow-[0_0_0_2px_color-mix(in_srgb,var(--status-open)_25%,transparent)] [animation:clock-pulse_2.4s_ease-in-out_infinite]"
                aria-hidden="true"
              />
              <span data-clock>--:--:--</span>
              <span className="text-[0.6rem] tracking-[0.18em] text-ink-3 uppercase">
                HKT
              </span>
            </span>
          </div>

          {/* Mobile-only: hamburger cell + modal panel (modal is `fixed`
            so it doesn't affect grid layout). Renders nothing visible
            above 640px. */}
          <MobileMenu />
        </div>
        <nav
          className={
            'flex justify-between items-center px-[16px] py-[12px] font-mono text-[0.74rem] ' +
            'uppercase tracking-[0.14em] flex-wrap gap-[12px] bg-paper ' +
            'shadow-[inset_0_-1px_0_0_var(--rule)] max-[640px]:hidden'
          }
          aria-label="Primary"
        >
          <div className="flex gap-[1.75rem] flex-wrap">
            <Link href="/#maison" className="nav-link">
              <span lang="en">The Maison</span>
              <span lang="zh">工坊</span>
            </Link>
            <Link href="/#journal" className="nav-link">
              <span lang="en">Journal</span>
              <span lang="zh">札記</span>
            </Link>
            <Link href="/#contact" className="nav-link">
              <span lang="en">Contact</span>
              <span lang="zh">聯絡</span>
            </Link>
          </div>
          <Link className="cta cta-compact" href="/#contact">
            <span lang="en">Commission →</span>
            <span lang="zh">委託 →</span>
          </Link>
        </nav>
      </div>
      {children}
      <div className="grid grid-cols-2 max-[720px]:grid-cols-1 border-t border-rule font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-2">
        <div className="p-[16px] border-r border-rule max-[720px]:border-r-0 max-[720px]:border-b max-[720px]:border-rule">
          Agentic Maison · MMXXVI
        </div>
        <div className="p-[16px] text-right max-[720px]:text-left">
          <a href="https://www.seangentic.com">Made by Seangentic</a>
        </div>
      </div>
      <AtelierControls />
    </div>
  );
}
