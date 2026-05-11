import Link from "next/link";
import { AtelierControls } from "./atelier-controls";

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
 * <span lang="zh"> — F's CSS toggles visibility via [data-lang] on <html>.
 */
export function SheetShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="sheet">
      <span className="reg tl" /> <span className="reg tr" />
      <span className="reg bl" /> <span className="reg br" />

      {/* Sticky header band: titleblock + nav both stick to top of viewport. */}
      <div className="titleblock" role="group" aria-label="Atelier control panel">
        <div className="cell brand-cell">
          <Link href="/" aria-label="Agentic Maison — home">
            <span className="brand">
              <b>Agentic</b>
              <span className="bullet" aria-hidden="true" />
              <i>Maison</i>
            </span>
          </Link>
        </div>
        <div className="cell">
          <span className="text-toggle" role="group" aria-label="Theme">
            <button type="button" data-theme-btn="light" aria-pressed="false">
              <span lang="en">Light</span>
              <span lang="zh">淺</span>
            </button>
            <span className="sep" aria-hidden="true">/</span>
            <button type="button" data-theme-btn="dark" aria-pressed="false">
              <span lang="en">Dark</span>
              <span lang="zh">深</span>
            </button>
          </span>
        </div>
        <div className="cell">
          <span className="text-toggle" role="group" aria-label="Language">
            <button type="button" data-lang-btn="en" aria-pressed="false">EN</button>
            <span className="sep" aria-hidden="true">/</span>
            <button type="button" data-lang-btn="zh" aria-pressed="false">中文</button>
          </span>
        </div>
        <div className="cell">
          <span className="clock" aria-live="off">
            <span className="clock-dot" aria-hidden="true" />
            <span data-clock>--:--:--</span>
            <span className="clock-tz">HKT</span>
          </span>
        </div>
      </div>

      <nav className="nav" aria-label="Primary">
        <div className="nav-links">
          <Link href="/#maison"><span lang="en">The Maison</span><span lang="zh">工坊</span></Link>
          <Link href="/#services"><span lang="en">Practice</span><span lang="zh">服務</span></Link>
          <Link href="/#contact"><span lang="en">Contact</span><span lang="zh">聯絡</span></Link>
          <Link href="/#journal"><span lang="en">Journal</span><span lang="zh">札記</span></Link>
        </div>
        <Link className="nav-cta" href="/#contact">
          <span lang="en">Commission →</span>
          <span lang="zh">委託 →</span>
        </Link>
      </nav>

      {children}

      <div className="footer">
        <div>Agentic Maison · MMXXVI</div>
        <div className="right">
          <span lang="en">Hong Kong · Worldwide</span>
          <span lang="zh">香港 · 全球</span>
        </div>
      </div>

      <AtelierControls />
    </div>
  );
}
