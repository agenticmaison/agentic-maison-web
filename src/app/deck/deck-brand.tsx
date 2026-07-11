import Link from 'next/link';
import { Wordmark } from '@/components/wordmark';

type DeckBrandProps = {
  /** Header link to home; omit on the unlock gate. */
  href?: string;
  className?: string;
};

/**
 * Agentic ◆ Maison lockup — deck masthead and unlock gate (am-010).
 *
 * Renders the locked two-colour Radley wordmark (am-009) via the shared
 * `Wordmark` component: the letters follow the ambient `text-ink` colour so the
 * mark themes light/dark automatically, while the brass diamond holds via
 * `var(--brass)` and never inverts. The mark is ~14.5:1, so it is sized by
 * height with a `max-width` guard to prevent overflow on narrow viewports
 * (matches the am-005 web-deck masthead treatment).
 */
export function DeckBrand({ href, className = '' }: DeckBrandProps) {
  const mark = (
    <Wordmark className="h-[1.1rem] w-auto max-w-[min(220px,52vw)]" />
  );
  const base = 'inline-flex items-center text-ink';

  if (href) {
    return (
      <Link
        href={href}
        aria-label="Agentic Maison — home"
        className={`${base} ${className}`.trim()}
      >
        {mark}
      </Link>
    );
  }

  return <span className={`${base} ${className}`.trim()}>{mark}</span>;
}
