'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Wordmark } from '@/components/wordmark';
import { ContactForm } from '@/components/contact-form';
import type { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/paths';
import { contact, scenes, ui, type Scene } from '@/lib/chateau/content';
import { FrameLoader } from '@/lib/chateau/frame-loader';
import {
  beatOpacity,
  buildTimeline,
  clamp,
  coverFit,
  quadAt,
  quadToMatrix3d,
  sampleAt,
  windowOpacity,
} from '@/lib/chateau/timeline';
import { SalesPhone } from './sales-phone';

const timeline = buildTimeline(scenes);
const SALES_INDEX = scenes.findIndex((s) => s.id === 'sales');

type Mode = 'tour' | 'static';

/** Local vh window, inside the Sales scene, over which the agent reply is revealed. */
const REPLY_REVEAL: [number, number] = [80, 95];

export function ChateauTour({ locale }: { locale: Locale }) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
  const [modeOverride, setMode] = useState<Mode | null>(null);
  const mode: Mode = modeOverride ?? (reducedMotion ? 'static' : 'tour');
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [percent, setPercent] = useState(0);
  const [skipHidden, setSkipHidden] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLElement | null)[]>([]);
  const hintRef = useRef<HTMLSpanElement>(null);
  const afterRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const afterId = ui.afterTourId;

  useEffect(() => {
    if (mode !== 'tour') return;
    // Hydration renders the tour before the client's reduced-motion snapshot
    // is read; do not pin anything that is about to be swapped for stills.
    if (getReducedMotion()) return;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      setMode('static');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const loader = new FrameLoader(scenes);
    let disposed = false;
    let scrollVh = 0;
    let lastDrawnFrame = -1;
    let lastRequested = -1;
    let needsDraw = true;
    let vw = 0;
    let vh = 0;
    let dpr = 1;
    let unlocked = false;

    // ── Canvas sizing ───────────────────────────────────────────────────
    const resize = () => {
      const rect = stage.getBoundingClientRect();
      vw = Math.max(1, Math.round(rect.width));
      vh = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastDrawnFrame = -1;
      needsDraw = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    // ── Overlay state, a pure function of scroll position ───────────────
    const setBlock = (el: HTMLElement | null, opacity: number, rise = 14) => {
      if (!el) return;
      const o = Math.round(opacity * 1000) / 1000;
      el.style.opacity = String(o);
      const base = el.dataset.placement === 'hero' ? 'translateY(-50%) ' : '';
      el.style.transform = `${base}translateY(${((1 - o) * rise).toFixed(2)}px)`;
      const hidden = o < 0.02;
      if (el.inert !== hidden) {
        el.inert = hidden;
        el.setAttribute('aria-hidden', hidden ? 'true' : 'false');
      }
    };

    const updateOverlays = () => {
      const s = sampleAt(timeline, scrollVh);
      const sceneIndex = timeline.ranges.indexOf(s.range);
      scenes.forEach((scene, i) => {
        const el = copyRefs.current[i];
        const o =
          i === sceneIndex ? beatOpacity(scene.copy.beat, s.localVh) : 0;
        setBlock(el, o);
      });
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - clamp(scrollVh / 20, 0, 1));
      }

      const plane = planeRef.current;
      const sales = scenes[SALES_INDEX];
      if (plane && sales.plane) {
        if (sceneIndex === SALES_INDEX) {
          const o = windowOpacity(
            sales.plane.visible,
            sales.plane.feather,
            s.localFrameExact,
          );
          const fit = coverFit(
            sales.manifest.width,
            sales.manifest.height,
            vw,
            vh,
          );
          const q = quadAt(sales.plane.keys, s.localFrameExact);
          const px = q.map(([fx, fy]) => [
            fit.x + fx * sales.manifest.width * fit.scale,
            fit.y + fy * sales.manifest.height * fit.scale,
          ]) as typeof q;
          plane.style.transform = quadToMatrix3d(
            plane.offsetWidth,
            plane.offsetHeight,
            px,
          );
          plane.style.opacity = o.toFixed(3);
          const [r0, r1] = REPLY_REVEAL;
          plane.style.setProperty(
            '--reply',
            clamp((s.localVh - r0) / (r1 - r0), 0, 1).toFixed(3),
          );
          const live = o > 0.02;
          plane.dataset.live = live ? 'true' : 'false';
          if (plane.inert === live) {
            plane.inert = !live;
            plane.setAttribute('aria-hidden', live ? 'false' : 'true');
          }
        } else if (plane.style.opacity !== '0') {
          plane.style.opacity = '0';
          plane.dataset.live = 'false';
          plane.inert = true;
          plane.setAttribute('aria-hidden', 'true');
        }
      }
    };

    // ── Draw ────────────────────────────────────────────────────────────
    const draw = () => {
      const s = sampleAt(timeline, scrollVh);
      if (s.frame !== lastRequested) {
        lastRequested = s.frame;
        if (unlocked) loader.setCurrent(s.frame);
      }
      const d = loader.drawable(s.frame);
      if (d && d.index !== lastDrawnFrame) {
        const m = s.range.scene.manifest;
        const fit = coverFit(m.width, m.height, vw, vh);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, vw, vh);
        ctx.drawImage(
          d.source,
          fit.x,
          fit.y,
          m.width * fit.scale,
          m.height * fit.scale,
        );
        lastDrawnFrame = d.index;
        if (d.index === s.frame) loader.warm(s.frame);
      }
      updateOverlays();
    };

    const tick = () => {
      if (!needsDraw) return;
      needsDraw = false;
      draw();
    };

    // ── Scroll: Lenis smooths, ScrollTrigger pins and scrubs ───────────
    const lenis = new Lenis({ autoRaf: false, lerp: 0.12 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const rafBridge = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafBridge);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();

    const trigger = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: () => `+=${(timeline.totalVh / 100) * window.innerHeight}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        scrollVh = self.progress * timeline.totalVh;
        needsDraw = true;
      },
      onLeave: () => setSkipHidden(true),
      onEnterBack: () => setSkipHidden(false),
    });

    // A frame that arrives after we asked for it should still be drawn.
    const unsubscribe = loader.subscribe(() => {
      needsDraw = true;
    });

    // ── Loading: scene one gates the scroll, the rest streams ──────────
    const total0 = loader.sceneProgress(0).total;
    const unlockIfReady = () => {
      if (disposed || unlocked) return;
      const p = loader.sceneProgress(0);
      const pct = Math.round((p.ready / total0) * 100);
      setPercent(pct);
      if (p.ready + p.failed < total0) return;
      if (p.failed > total0 * 0.1) {
        setFailed(true);
        setMode('static');
        return;
      }
      unlocked = true;
      setLoaded(true);
      lenis.start();
      loader.setCurrent(lastRequested < 0 ? 0 : lastRequested);
      needsDraw = true;
    };
    const unsubProgress = loader.subscribe(unlockIfReady);
    loader.requestScene(0);
    unlockIfReady();

    const onVisibility = () => {
      if (document.visibilityState === 'visible') needsDraw = true;
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', onVisibility);
      unsubscribe();
      unsubProgress();
      trigger.kill(true);
      gsap.ticker.remove(tick);
      gsap.ticker.remove(rafBridge);
      lenis.destroy();
      lenisRef.current = null;
      ro.disconnect();
      loader.dispose();
    };
  }, [mode]);

  const skipTour = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = afterRef.current;
    if (!target) return;
    e.preventDefault();
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.start();
      lenis.scrollTo(target, { immediate: true, force: true });
    } else {
      target.scrollIntoView();
    }
    target.focus({ preventScroll: true });
  };

  const home = localePath(locale, '/');
  const ctaHref = `#${afterId}`;

  return (
    <div className="ch-root" data-mode={mode}>
      <header className="ch-chrome">
        <Link
          href={home}
          className="ch-chrome-mark"
          aria-label="Agentic Maison — home"
        >
          <Wordmark />
        </Link>
        {mode === 'tour' && (
          <a
            href={ctaHref}
            className="ch-skip"
            onClick={skipTour}
            hidden={skipHidden}
          >
            {ui.skipTour}
          </a>
        )}
      </header>

      {mode === 'tour' ? (
        // The host is React's; ScrollTrigger re-parents the stage inside it
        // (pin-spacer), so React only ever removes the host on a mode switch.
        <div className="ch-stage-host">
          <div className="ch-stage" ref={stageRef}>
            {/* The poster is visible before the first frame is drawn. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="ch-poster"
              src={scenes[0].manifest.poster}
              alt=""
              aria-hidden
              fetchPriority="high"
              decoding="async"
            />
            <canvas className="ch-canvas" ref={canvasRef} aria-hidden />

            <div
              className="ch-plane"
              ref={planeRef}
              inert
              aria-hidden
              data-live="false"
            >
              <SalesPhone />
            </div>

            {scenes.map((scene, i) => (
              <CopyBlock
                key={scene.id}
                scene={scene}
                ctaHref={ctaHref}
                hintRef={i === 0 ? hintRef : undefined}
                initiallyVisible={i === 0}
                ref={(el) => {
                  copyRefs.current[i] = el;
                }}
              />
            ))}

            <div
              className="ch-loader"
              data-done={loaded ? 'true' : 'false'}
              aria-live="polite"
            >
              <div className="ch-loader-inner">
                <Wordmark />
                <p className="ch-loader-title">{ui.loaderTitle}</p>
                <p className="ch-loader-pct">{percent}%</p>
                <div className="ch-loader-bar" aria-hidden>
                  <span style={{ ['--p' as string]: percent / 100 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <main className="ch-static">
          {failed && <p className="ch-static-note">{ui.loaderFailed}</p>}
          {scenes.map((scene) => (
            <figure className="ch-still" key={scene.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={scene.manifest.poster}
                alt={scene.name}
                decoding="async"
              />
              {scene.id === 'sales' && (
                <div className="ch-still-phone">
                  <SalesPhone />
                </div>
              )}
              <figcaption className="ch-copy">
                {scene.copy.label && (
                  <span className="ch-label">{scene.copy.label}</span>
                )}
                <h2 className="ch-heading">{scene.copy.heading}</h2>
                <p className="ch-support">{scene.copy.support}</p>
                {scene.copy.cta && (
                  <a className="cta cta-primary" href={ctaHref}>
                    {ui.cta}
                  </a>
                )}
              </figcaption>
            </figure>
          ))}
        </main>
      )}

      <section className="ch-after" id={afterId} ref={afterRef} tabIndex={-1}>
        <div className="ch-after-inner">
          <div>
            <h2 className="ch-heading">{contact.heading}</h2>
            <p className="ch-support">{contact.support}</p>
            <a className="email-anchor" href={`mailto:${ui.nav.email}`}>
              {ui.nav.email}
            </a>
          </div>
          <ContactForm />
        </div>
        <nav className="ch-nav" aria-label="Site">
          <Link href={home} aria-label="Agentic Maison — home">
            <Wordmark />
          </Link>
          <ul>
            <li>
              <Link href={home}>{ui.nav.home}</Link>
            </li>
            <li>
              <Link href={localePath(locale, '/journal')}>
                {ui.nav.journal}
              </Link>
            </li>
            <li>
              <Link href={localePath(locale, '/digital')}>
                {ui.nav.digital}
              </Link>
            </li>
          </ul>
        </nav>
      </section>
    </div>
  );
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}
function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

function CopyBlock({
  scene,
  ctaHref,
  hintRef,
  initiallyVisible,
  ref,
}: {
  scene: Scene;
  ctaHref: string;
  hintRef?: React.RefObject<HTMLSpanElement | null>;
  initiallyVisible: boolean;
  ref: (el: HTMLElement | null) => void;
}) {
  const { copy } = scene;
  const isHero = copy.placement === 'hero';
  const Tag = isHero ? 'h1' : 'h2';
  return (
    <section
      ref={ref}
      className={`ch-copy ch-copy--${copy.placement}`}
      data-placement={copy.placement}
      aria-label={scene.name}
      inert={!initiallyVisible}
      aria-hidden={!initiallyVisible}
      style={initiallyVisible ? { opacity: 1 } : undefined}
    >
      {copy.label && <span className="ch-label">{copy.label}</span>}
      <Tag className="ch-heading">{copy.heading}</Tag>
      <p className="ch-support">{copy.support}</p>
      {copy.cta && (
        <a className="cta cta-primary" href={ctaHref}>
          {ui.cta}
        </a>
      )}
      {isHero && (
        <span className="ch-hint" ref={hintRef} aria-hidden>
          {ui.scrollHint}
        </span>
      )}
    </section>
  );
}
