import Link from 'next/link';
import { AtelierControls } from './atelier-controls';
import { MobileMenu } from './mobile-menu';
import { LanguageToggle } from './language-toggle';
import type { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/paths';

/**
 * SheetShell — drawing-sheet frame, sticky header band, and footer.
 * Used by the landing page and the stub subpages so they share the same
 * chrome. The page-specific content is rendered as `children`.
 *
 * Accepts a `locale` prop to prefix internal links and to render the
 * correct language toggle state.
 */

// Shared per-cell styles for the titleblock grid (always 4-col single row).
const cellBase = 'flex flex-col justify-center min-h-[64px]';

const cellStandard =
  cellBase +
  ' pt-[calc(12px+var(--sheet-frame-inset,0px))] pb-[12px] pl-[20px] pr-[16px]';

const cellBrand =
  cellBase +
  ' pt-[calc(14px+var(--sheet-frame-inset,0px))] pb-[14px] px-[16px]';

const shadowOdd = 'shadow-[inset_-1px_0_0_0_var(--rule)]';
const shadowEven = 'shadow-[inset_-1px_0_0_0_var(--rule)]';
const shadowLast = 'shadow-none';

const toggleBtn =
  'appearance-none bg-transparent border-0 text-ink-3 [font:inherit] uppercase ' +
  'px-[0.15rem] cursor-pointer transition-colors duration-200 ' +
  'hover:text-brass ' +
  'aria-pressed:text-ink aria-pressed:border-b aria-pressed:border-brass aria-pressed:pb-px';

const toggleGroup =
  'inline-flex gap-[0.35rem] items-center font-mono text-[0.74rem] uppercase tracking-[0.14em] text-ink-3';

export function SheetShell({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  return (
    <div className="sheet m-[18px] border border-rule">
      <span className="reg bl" /> <span className="reg br" />
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
            <Link href={localePath(locale, '/')}>
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
            <LanguageToggle locale={locale} />
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

          <MobileMenu locale={locale} />
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
            <Link href={localePath(locale, '/#maison')} className="nav-link">
              <span lang="en">The Maison</span>
              <span lang="zh">工坊</span>
            </Link>
            <Link href={localePath(locale, '/#journal')} className="nav-link">
              <span lang="en">Journal</span>
              <span lang="zh">札記</span>
            </Link>
            <Link href={localePath(locale, '/#contact')} className="nav-link">
              <span lang="en">Contact</span>
              <span lang="zh">聯絡</span>
            </Link>
          </div>
          <Link className="cta cta-compact" href={localePath(locale, '/#contact')}>
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
