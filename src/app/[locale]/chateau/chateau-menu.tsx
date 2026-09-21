'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { gsap } from 'gsap';
import type { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/paths';
import { menu, type MenuLink } from '@/lib/chateau/content';

/**
 * The /chateau menu: a trigger in the top-right of the chrome and a
 * full-screen overlay. Modelled on forgeautomotive.co.uk's menu, on the
 * tour's black ground.
 *
 * The trigger swaps its label ("Navigate" → "Close") with a skewed vertical
 * slide and turns its three lines into a cross with a 270° rotation. The
 * overlay fades in at once while its content settles from twice its size
 * with a blur; on close the content shrinks and blurs away first and the
 * ground fades a beat later. Every letter of a link is its own span carrying
 * a text-shadow copy above it, so a hovered link's letters slide down one
 * after another and the other links dim. The brand seal sits behind
 * the links and drifts against the cursor through two `gsap.quickTo`
 * setters; that is the only script-driven motion, everything else is CSS
 * transitions keyed off `data-open`.
 *
 * The parent owns scroll: `onOpenChange` fires on every toggle so the tour
 * can stop Lenis while the overlay is up. Body overflow is locked here for
 * the static layout, which has no Lenis.
 */
export function ChateauMenu({
  locale,
  onOpenChange,
  onNavigate,
}: {
  locale: Locale;
  onOpenChange?: (open: boolean) => void;
  /** Called for in-page links (`href` starting with `#`) after the menu closes. */
  onNavigate?: (href: string) => void;
}) {
  const [open, setOpen] = useState(false);
  // The overlay portals to <body>: rendered inside the fixed header it
  // would sit in the header's stacking context, over the wordmark and the
  // trigger it is meant to sit under.
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const overlayRef = useRef<HTMLElement>(null);
  const figureRef = useRef<SVGSVGElement>(null);
  const openRef = useRef(false);
  const pendingHref = useRef<string | null>(null);
  const toX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const toY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const panelId = useId();

  const setOpenState = (next: boolean) => {
    openRef.current = next;
    setOpen(next);
    onOpenChange?.(next);
  };

  // Escape closes; body scroll locks while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenState(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Cursor parallax on the background figure: desktop pointers only, and
  // never under reduced motion. The figure eases back to rest on close.
  useEffect(() => {
    const el = figureRef.current;
    if (!el) return;
    const fine = window.matchMedia(
      '(min-width: 1024px) and (hover: hover) and (pointer: fine)',
    );
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduced.matches) return;
    const x = gsap.quickTo(el, 'x', { duration: 0.85, ease: 'power2.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.85, ease: 'power2.out' });
    toX.current = x;
    toY.current = y;
    const onMove = (e: MouseEvent) => {
      if (!openRef.current) return;
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      x(-(120 * dx));
      y(-(120 * dy));
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      toX.current = null;
      toY.current = null;
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [mounted]);

  // On close the figure eases back, and an in-page link fires now rather
  // than in its click handler: the scroll lock above has been lifted by
  // this point, so Lenis measures the real document height.
  useEffect(() => {
    if (open) return;
    toX.current?.(0);
    toY.current?.(0);
    const href = pendingHref.current;
    if (href) {
      pendingHref.current = null;
      onNavigate?.(href);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // The overlay is inert while closed so its links leave the tab order.
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    if (open) el.removeAttribute('inert');
    else el.setAttribute('inert', '');
  }, [open, mounted]);

  const handleLink = (link: MenuLink) => (e: React.MouseEvent) => {
    if (!link.href.startsWith('#')) {
      setOpenState(false);
      return;
    }
    e.preventDefault();
    pendingHref.current = link.href;
    setOpenState(false);
  };

  return (
    <>
      <button
        type="button"
        className="ch-menu-trigger"
        aria-label={menu.ariaLabel}
        aria-expanded={open}
        aria-controls={panelId}
        data-open={open ? 'true' : 'false'}
        onClick={() => setOpenState(!open)}
      >
        <em>
          <span data-menu="closed">{menu.open}</span>
          <span data-menu="open">{menu.close}</span>
        </em>
        <i className="ch-menu-icon" aria-hidden>
          <span />
          <span />
          <span />
        </i>
      </button>

      {mounted &&
        createPortal(
          <nav
            className="ch-menu"
            id={panelId}
            ref={overlayRef}
            aria-label={menu.ariaLabel}
            data-open={open ? 'true' : 'false'}
          >
            <figure className="ch-menu-figure" aria-hidden>
              {/* The seal roundel, from
                  `company/brand/logo/svg/am-seal-roundel-white.svg`, in
                  currentColor; the stylesheet sets the colour. */}
              <svg ref={figureRef} viewBox="0 0 2500 2500" aria-hidden>
                <g transform="translate(439.8 1600) scale(1 -1)">
                  <circle
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="137.5"
                    cx="810.2"
                    cy="350"
                    r="1131.2"
                  />
                  <path fill="currentColor" d="M355.76171875 718.0478515625 672.0009765625 6.0H524.25927734375L308.64111328125 557.87744140625ZM140.76171875 73.0Q132.9521484375 53.0 137.9521484375 39.0Q142.9521484375 25.0 154.85693359375 17.5Q166.76171875 10.0 178.76171875 10.0H187.76171875V0.0H-22.1435546875V10.0Q-22.1435546875 10.0 -17.6435546875 10.0Q-13.1435546875 10.0 -13.1435546875 10.0Q9.8564453125 10.0 34.3564453125 24.5Q58.8564453125 39.0 74.8564453125 73.0ZM355.76171875 718.0478515625 361.11865234375 613.236328125 112.142578125 3.0H43.64208984375L301.666015625 596.427734375Q303.68994140625 600.07080078125 310.404296875 615.404296875Q317.11865234375 630.73779296875 325.42822265625 650.76171875Q333.73779296875 670.78564453125 340.04736328125 689.40478515625Q346.35693359375 708.02392578125 346.76171875 718.0478515625ZM472.87939453125 249.92724609375V211.83154296875H172.02294921875V249.92724609375ZM497.64013671875 73.0H641.97705078125Q657.78662109375 39.0 682.3818359375 24.5Q706.97705078125 10.0 729.97705078125 10.0Q729.97705078125 10.0 733.97705078125 10.0Q737.97705078125 10.0 737.97705078125 10.0V0.0H450.64013671875V10.0H459.64013671875Q479.044921875 10.0 494.247314453125 26.5Q509.44970703125 43.0 497.64013671875 73.0Z M1461.90625 714.0 1469.90625 619.06982421875 1188.142578125 89.619140625Q1188.142578125 89.619140625 1179.225830078125 72.21435546875Q1170.30908203125 54.8095703125 1161.297119140625 30.09521484375Q1152.28515625 5.380859375 1150.904296875 -18.0478515625H1141.30908203125L1110.30810546875 61.1435546875ZM804.80859375 73.0V0.0H693.80859375V10.0Q694.80859375 10.0 702.30859375 10.0Q709.80859375 10.0 709.80859375 10.0Q736.80859375 10.0 757.80859375 26.5Q778.80859375 43.0 782.80859375 73.0ZM843.92822265625 57.0Q843.92822265625 56.0 843.92822265625 55.0Q843.92822265625 54.0 843.92822265625 52.0Q843.92822265625 36.0 855.42822265625 22.5Q866.92822265625 9.0 882.92822265625 9.0H898.3330078125V0.0H836.92822265625V57.0ZM863.07080078125 714.0H872.666015625L902.78564453125 627.474609375L838.11865234375 0.0H773.9990234375ZM872.666015625 714.0 1186.572265625 148.4794921875 1141.30908203125 -18.0478515625 849.21337890625 518.6142578125ZM1470.90625 714.0 1562.97802734375 0.0H1429.92724609375L1377.7607421875 508.44677734375L1461.90625 714.0ZM1532.16845703125 73.0H1553.5732421875Q1558.5732421875 43.0 1579.370849609375 26.5Q1600.16845703125 10.0 1626.5732421875 10.0Q1626.5732421875 10.0 1634.370849609375 10.0Q1642.16845703125 10.0 1642.5732421875 10.0V0.0H1532.16845703125ZM1424.11767578125 57.0H1431.11767578125V0.0H1369.712890625V9.0H1385.11767578125Q1401.712890625 9.0 1412.915283203125 22.5Q1424.11767578125 36.0 1424.11767578125 52.0Q1424.11767578125 54.0 1424.11767578125 55.0Q1424.11767578125 56.0 1424.11767578125 57.0Z" />
                </g>
              </svg>
            </figure>
            <div className="ch-menu-inner">
              <ul data-name="pages">
                {menu.pages.map((link) => (
                  <li key={link.href}>
                    <MenuItem
                      link={link}
                      href={
                        link.href.startsWith('#')
                          ? link.href
                          : localePath(locale, link.href)
                      }
                      onClick={handleLink(link)}
                    />
                  </li>
                ))}
              </ul>
              <ul data-name="small">
                {menu.small.map((link) => (
                  <li key={link.href}>
                    <MenuItem
                      link={link}
                      href={link.href}
                      onClick={handleLink(link)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </nav>,
          document.body,
        )}
    </>
  );
}

function MenuItem({
  link,
  href,
  onClick,
}: {
  link: MenuLink;
  href: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  const letters = Array.from(link.label).map((ch, i) => (
    <span key={`${i}-${ch}`}>{ch === ' ' ? ' ' : ch}</span>
  ));
  const external = /^(https?:|mailto:)/.test(href);
  if (external || href.startsWith('#')) {
    return (
      <a href={href} aria-label={link.label} onClick={onClick}>
        {letters}
      </a>
    );
  }
  return (
    <Link href={href} aria-label={link.label} onClick={onClick}>
      {letters}
    </Link>
  );
}

function subscribeNoop() {
  return () => {};
}
