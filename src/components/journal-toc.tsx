'use client';

import { useEffect, useMemo, useState } from 'react';

/**
 * Sticky table of contents for journal entries (desktop only).
 *
 * Lives in a CSS grid column alongside the article. Uses
 * IntersectionObserver to highlight the active section as the
 * reader scrolls through the article.
 *
 * Hidden on viewports < 1280px where the grid collapses to
 * single-column and there is no space for the TOC.
 */

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function JournalToc({
  headings,
  englishFallback = false,
}: {
  headings: TocItem[];
  /**
   * True when the entry has no Chinese translation and this page is serving the
   * English article. The heading text is then English on a Chinese route, so
   * the nav declares `lang="en"` — and carries `data-en-fallback`, without
   * which the `[data-lang='zh'] [lang='en']` rule in globals.css would hide it.
   */
  englishFallback?: boolean;
}) {
  const [activeId, setActiveId] = useState<string>('');
  // The article may use lower-level headings for its internal structure, but
  // the TOC presents top-level sections only.
  const h2Headings = useMemo(
    () => headings.filter((heading) => heading.level === 2),
    [headings]
  );

  useEffect(() => {
    if (h2Headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that is intersecting (visible in viewport)
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        // rootMargin: negative top accounts for sticky header, generous bottom
        // so the heading is detected well before it leaves the viewport.
        rootMargin: '-140px 0px -66% 0px',
        threshold: 0,
      }
    );

    // Observe all heading elements in the article
    const elements = h2Headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [h2Headings]);

  if (h2Headings.length === 0) return null;

  return (
    <nav
      {...(englishFallback ? { lang: 'en', 'data-en-fallback': '' } : {})}
      className="hidden min-[1280px]:block pt-[clamp(1.25rem,2vw,1.75rem)] sticky top-[150px]"
      aria-label="Table of contents"
    >
      <span className="block font-mono font-bold text-[0.72rem] tracking-[0.16em] uppercase text-brass mb-[0.75rem]">
        Contents
      </span>
      <ul className="list-none m-0 p-0 space-y-[0.65rem]">
        {h2Headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block font-body text-[0.88rem] leading-[1.45] transition-all duration-200 no-underline ${
                activeId === heading.id
                  ? 'text-ink font-semibold border-l-[3px] border-brass pl-[0.65rem]'
                  : 'text-ink-3 hover:text-ink border-l-[3px] border-transparent pl-[0.65rem]'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
