import Link from 'next/link';
import { Wordmark } from './wordmark';
import { AtelierControls } from './atelier-controls';
import { MobileMenu } from './mobile-menu';
import { LanguageToggle } from './language-toggle';
import type { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/paths';

/**
 * SheetShell — drawing-sheet frame, sticky header band, and footer.
 * Used by the landing page, the journal, the tour and the stub subpages so
 * they share the same chrome. The page-specific content is rendered as
 * `children`.
 *
 * The header band is one titleblock row: wordmark, primary links, language
 * toggle, Commission. There is no second nav row; `--nav-h` in globals.css
 * is 0 for that reason.
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

const cellDivider = 'shadow-[inset_-1px_0_0_0_var(--rule)]';
const cellLast = 'shadow-none';

export function SheetShell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <div className="sheet m-[18px] border border-rule">
      <span className="reg bl" /> <span className="reg br" />
      <div className="sheet-top-bar" role="presentation">
        <span className="reg tl" /> <span className="reg tr" />
        <div
          className={
            'grid grid-cols-[2fr_1.7fr_0.8fr_1fr] max-[640px]:grid-cols-[1fr_auto] ' +
            'font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-2 bg-paper ' +
            'shadow-[inset_0_-1px_0_0_var(--rule)]'
          }
          role="group"
          aria-label="Atelier control panel"
        >
          <div className={`${cellBrand} ${cellDivider}`}>
            <Link
              href={localePath(locale, '/')}
              className="inline-flex items-center text-ink"
              aria-label="Agentic Maison — home"
            >
              <Wordmark className="h-[15px] w-auto" />
            </Link>
          </div>
          <nav
            className={`${cellStandard} ${cellDivider} max-[640px]:hidden`}
            aria-label="Primary"
          >
            <div className="flex gap-[1.75rem] flex-wrap font-mono text-[0.74rem] uppercase tracking-[0.14em]">
              <Link href={localePath(locale, '/#maison')} className="nav-link">
                <span lang="en">The Maison</span>
                <span lang="zh">工坊</span>
              </Link>
              <Link href={localePath(locale, '/#process')} className="nav-link">
                <span lang="en">The Process</span>
                <span lang="zh">過程</span>
              </Link>
              <Link href={localePath(locale, '/journal')} className="nav-link">
                <span lang="en">The Journal</span>
                <span lang="zh">札記</span>
              </Link>
            </div>
          </nav>
          <div className={`${cellStandard} ${cellDivider} max-[640px]:hidden`}>
            <LanguageToggle locale={locale} />
          </div>
          <div
            className={`${cellStandard} ${cellLast} max-[640px]:hidden items-start`}
          >
            <Link
              className="cta cta-compact"
              href={localePath(locale, '/#contact')}
            >
              <span lang="en">Commission →</span>
              <span lang="zh">委託 →</span>
            </Link>
          </div>

          <MobileMenu locale={locale} />
        </div>
      </div>
      {children}
      <div className="grid grid-cols-2 max-[720px]:grid-cols-1 border-t border-rule font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-2">
        <div className="p-[16px] border-r border-rule max-[720px]:border-r-0 max-[720px]:border-b max-[720px]:border-rule">
          <span className="inline-flex items-center gap-[0.6rem] text-ink">
            <Wordmark className="h-[13px] w-auto" />
            <span className="text-ink-2">· MMXXVI</span>
          </span>
        </div>
        <div className="p-[16px] text-right max-[720px]:text-left">
          <a href="https://www.seangentic.com">Made by Seangentic</a>
        </div>
      </div>
      <AtelierControls />
    </div>
  );
}
