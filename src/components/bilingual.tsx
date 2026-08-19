import type { ReactNode } from 'react';

/**
 * A piece of journal text in both languages — or in English alone, correctly
 * labelled, when the entry has no Chinese translation.
 *
 * ## Why both languages are in the markup at all
 *
 * The site renders every fixed string twice, once per language, and lets CSS
 * show the one matching `<html data-lang>` (`globals.css`, `@layer base`). This
 * component exists to put an entry's *content* through the same mechanism
 * without lying about it.
 *
 * ## What `fallback` changes
 *
 * An English-only entry still has a `/zh/` route, and that route serves the
 * English article — a blank page or a 404 would be worse for a reader who
 * followed a link. But the text is English, so:
 *
 * - it is marked `lang="en"`, not `lang="zh"`. A screen reader announcing
 *   English prose in a Chinese voice is the audible version of the
 *   `hreflang="zh-HK"` mistake the page metadata avoids;
 * - it is emitted **once**, not duplicated into a second span;
 * - it carries `data-en-fallback`, which is the attribute the `[data-lang='zh']
 *   [lang='en']` hiding rule excludes. Without it the zh route would hide the
 *   only copy of the article and render an empty page.
 *
 * Set on any element carrying `lang="en"` whose content must survive on the zh
 * route — the article body and the table of contents use it directly rather
 * than through this component.
 */
export function Bilingual({
  en,
  zh,
  fallback = false,
}: {
  en: ReactNode;
  /** Ignored when `fallback` is true, where it holds the English value. */
  zh: ReactNode;
  fallback?: boolean;
}) {
  if (fallback) {
    return (
      <span lang="en" data-en-fallback="">
        {en}
      </span>
    );
  }
  return (
    <>
      <span lang="en">{en}</span>
      <span lang="zh">{zh}</span>
    </>
  );
}
