'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wordmark } from './wordmark';
import { ChateauMenu } from './chateau-menu';
import type { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/paths';
import type { MenuLink } from '@/lib/chateau/content';
import './maison-chrome.css';

/**
 * MaisonChrome — the frame the tour and the journal share: the wordmark
 * fixed top-left, the menu trigger top-right, and the full-screen menu
 * overlay behind them. No nav row, no language toggle, no theme toggle.
 *
 * `ground` says what the marks sit over: `scene` (footage; the marks carry a
 * drop shadow) or `page` (flat paper; none). `pages` replaces the menu's
 * page links for routes where the tour's in-page anchors do not exist.
 */
export function MaisonChrome({
  locale,
  ground = 'page',
  pages,
  onOpenChange,
  onNavigate,
}: {
  locale: Locale;
  ground?: 'scene' | 'page';
  pages?: MenuLink[];
  onOpenChange?: (open: boolean) => void;
  onNavigate?: (href: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="ch-chrome"
      data-ground={ground}
      data-menu-open={open ? 'true' : 'false'}
    >
      <Link
        href={localePath(locale, '/')}
        className="ch-chrome-mark"
        aria-label="Agentic Maison — home"
      >
        <Wordmark />
      </Link>
      <ChateauMenu
        locale={locale}
        pages={pages}
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange?.(next);
        }}
        onNavigate={onNavigate}
      />
    </header>
  );
}
