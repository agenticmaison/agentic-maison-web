import { localePath } from '@/i18n/paths';
import { DeckBrand } from './deck-brand';
import { Bilingual } from './deck-i18n';

/**
 * Sticky control strip for /deck — theme, language, present.
 * `DeckControls` attaches handlers via data-* attributes on these elements.
 */
export function DeckTopbar() {
  return (
    <header
      className="deck-topbar sticky top-0 z-50 grid grid-cols-[1fr_auto_auto] items-center border-b border-rule bg-paper px-7 py-3.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-2 max-[720px]:static max-[720px]:top-auto max-[720px]:grid-cols-[1fr_auto] max-[720px]:gap-x-4 max-[720px]:gap-y-3 max-[720px]:px-4 max-[720px]:py-3"
      role="banner"
    >
      <div>
        <DeckBrand href={localePath('en', '/')} />
        <span className="doctype ml-[1.4rem] text-ink-3 max-[720px]:hidden">
          <Bilingual en="AI Practice · Presentation" zh="AI 實務 · 簡報" />
        </span>
      </div>
      <nav
        className="deck-controls inline-flex items-center gap-[1.2rem] max-[720px]:col-span-full max-[720px]:justify-start max-[720px]:gap-[0.9rem]"
        aria-label="Deck controls"
      >
        <span
          className="group inline-flex items-center gap-[0.35rem]"
          role="group"
          aria-label="Theme"
        >
          <button
            type="button"
            data-theme-btn="light"
            className="cursor-pointer appearance-none border-0 bg-transparent p-[0.15rem_0.2rem] font-[inherit] text-ink-3 hover:text-brass aria-pressed:text-ink aria-pressed:border-b aria-pressed:border-brass aria-pressed:pb-px"
          >
            <Bilingual en="Light" zh="淺色" />
          </button>
          <span className="sep text-ink-3">/</span>
          <button
            type="button"
            data-theme-btn="dark"
            className="cursor-pointer appearance-none border-0 bg-transparent p-[0.15rem_0.2rem] font-[inherit] text-ink-3 hover:text-brass aria-pressed:text-ink aria-pressed:border-b aria-pressed:border-brass aria-pressed:pb-px"
          >
            <Bilingual en="Dark" zh="深色" />
          </button>
        </span>
        <span
          className="group inline-flex items-center gap-[0.35rem]"
          role="group"
          aria-label="Language"
        >
          <button
            type="button"
            data-lang-btn="en"
            className="cursor-pointer appearance-none border-0 bg-transparent p-[0.15rem_0.2rem] font-[inherit] text-ink-3 hover:text-brass aria-pressed:text-ink aria-pressed:border-b aria-pressed:border-brass aria-pressed:pb-px"
          >
            EN
          </button>
          <span className="sep text-ink-3">/</span>
          <button
            type="button"
            data-lang-btn="zh"
            className="cursor-pointer appearance-none border-0 bg-transparent p-[0.15rem_0.2rem] font-[inherit] text-ink-3 hover:text-brass aria-pressed:text-ink aria-pressed:border-b aria-pressed:border-brass aria-pressed:pb-px"
          >
            中文
          </button>
        </span>
      </nav>
      <button
        type="button"
        data-present
        className="present-btn ml-[1.2rem] cursor-pointer appearance-none border border-ink bg-ink px-3.5 py-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-paper transition-colors duration-200 hover:border-brass hover:bg-brass max-[720px]:col-start-2 max-[720px]:row-start-1 max-[720px]:ml-0 max-[720px]:px-2.5 max-[720px]:py-1.5"
      >
        <Bilingual en="Present →" zh="簡報 →" />
      </button>
    </header>
  );
}
