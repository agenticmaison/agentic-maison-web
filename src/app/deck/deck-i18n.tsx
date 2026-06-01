import type { ReactNode } from 'react';

/** Paired EN / ZH spans; visibility toggled by `data-lang` on `<html>`. */
export function Bilingual({ en, zh }: { en: ReactNode; zh: ReactNode }) {
  return (
    <>
      <span lang="en">{en}</span>
      <span lang="zh">{zh}</span>
    </>
  );
}
