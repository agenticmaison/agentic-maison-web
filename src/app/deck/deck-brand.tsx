import Link from 'next/link';
import type { ReactNode } from 'react';

const diamond = (
  <span className="diamond inline-block h-1.5 w-1.5 rotate-45 self-center bg-brass" aria-hidden="true" />
);

type DeckBrandProps = {
  /** Header link to home; omit on unlock gate. */
  href?: string;
  className?: string;
};

/** Agentic ◆ Maison lockup — deck header and unlock gate. */
export function DeckBrand({ href, className = '' }: DeckBrandProps) {
  const inner: ReactNode = (
    <>
      <b className="font-medium not-italic">Agentic</b>
      {diamond}
      <i>Maison</i>
    </>
  );

  const base =
    'inline-flex items-baseline gap-2 font-display text-[1.05rem] italic tracking-[-0.005em] text-ink normal-case';

  if (href) {
    return (
      <Link href={href} className={`${base} ${className}`.trim()}>
        {inner}
      </Link>
    );
  }

  return <span className={`${base} ${className}`.trim()}>{inner}</span>;
}
