import type { ReactNode } from 'react';
import { Wordmark } from '@/components/wordmark';
import { slideClass } from './deck-config';

type DeckSlideProps = {
  id: number;
  extraClass?: string;
  /** Standard title row (`slide-head` + `slide-title-row`). Omit for cover-style slides. */
  title?: ReactNode;
  titleClassName?: string;
  showHead?: boolean;
  bodyClassName?: string;
  position: number;
  total: number;
  children: ReactNode;
};

export function DeckSlide({
  id,
  extraClass = '',
  title,
  titleClassName = 'slide-title',
  showHead = true,
  bodyClassName = 'slide-body',
  position,
  total,
  children,
}: DeckSlideProps) {
  return (
    <article className={slideClass(id, extraClass)} data-slide={String(id)}>
      <span className="reg tl" aria-hidden="true" />
      <span className="reg bl" aria-hidden="true" />
      {title !== undefined ? (
        <>
          {showHead ? <div className="slide-head" /> : null}
          <div className="slide-title-row">
            <h2 className={titleClassName}>{title}</h2>
          </div>
        </>
      ) : null}
      <div className={bodyClassName}>{children}</div>
      <footer className="slide-foot">
        <span className="brand-mark">
          <Wordmark />
        </span>
        <span className="pageno">
          <b>{position}</b> / {total}
        </span>
      </footer>
    </article>
  );
}

/** Cover slide: title lives inside body, not the standard title row. */
export function DeckCoverSlide({
  id,
  extraClass = '',
  position,
  total,
  children,
}: Omit<DeckSlideProps, 'title' | 'showHead' | 'bodyClassName' | 'titleClassName'> & {
  children: ReactNode;
}) {
  return (
    <article className={slideClass(id, extraClass)} data-slide={String(id)}>
      <span className="reg tl" aria-hidden="true" />
      <span className="reg bl" aria-hidden="true" />
      <div className="slide-body">{children}</div>
      <footer className="slide-foot">
        <span className="brand-mark">
          <Wordmark />
        </span>
        <span className="pageno">
          <b>{position}</b> / {total}
        </span>
      </footer>
    </article>
  );
}
