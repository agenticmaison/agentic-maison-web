/**
 * Hero mechanism — Iteration F1, Variant A (Centered orbit).
 *
 * <!-- ASSET-SWAP POINT #F1 -->
 *
 * Layered-PNG composition ported verbatim from the am-007 winning variant:
 *   1-projects/agentic-maison-launch/designs/landing-structure/animated-mechanism-v2/index-v3a.html
 *
 * Six PNG layers (1 center wheel + 5 workers) live in /public/assets/mechanism/.
 * They're absolutely positioned inside a fixed-aspect 3:4 canvas (.mech-canvas)
 * so the composition scales as a single unit at any viewport size. Positions
 * and sizes are percentages of the canvas, not the pane.
 *
 * Animation is pure CSS, driven by the --p-overall custom property on <html>
 * (written by AtelierControls' scroll listener). Each layer has its own
 * fade-in window and counter-rotating speed; the center wheel always shows
 * at ~18% opacity so the schematic isn't empty on first paint.
 *
 * Plain <img> (not next/image) is used here intentionally: every layer is
 * absolutely positioned with percent-based widths inside a CSS-controlled
 * fixed-aspect parent. next/image's `fill` mode adds wrapper divs that
 * conflict with the .layer transform-origin + mix-blend-mode chain, and
 * its responsive sizing logic provides no benefit when widths are already
 * pinned in CSS. The center wheel is hinted to the browser as a high-
 * priority preload via fetchPriority="high" + loading="eager" so it
 * still serves as the LCP candidate.
 *
 * Other plate-swap points (#F2, #F3) are unaffected by this component.
 */
export function HeroMechanismLayers() {
  return (
    <div className="mech-stage" aria-hidden="true">
      <div className="mech-canvas">
        <div className="layer layer-center">
          <img
            src="/assets/mechanism/center-wheel.png"
            alt=""
            width={614}
            height={586}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="layer layer-w1">
          <img
            src="/assets/mechanism/worker-1.png"
            alt=""
            width={242}
            height={252}
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="layer layer-w2">
          <img
            src="/assets/mechanism/worker-2.png"
            alt=""
            width={275}
            height={272}
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="layer layer-w3">
          <img
            src="/assets/mechanism/worker-3.png"
            alt=""
            width={208}
            height={211}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="layer layer-w4">
          <img
            src="/assets/mechanism/worker-4.png"
            alt=""
            width={220}
            height={230}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="layer layer-w5">
          <img
            src="/assets/mechanism/worker-5.png"
            alt=""
            width={276}
            height={279}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
