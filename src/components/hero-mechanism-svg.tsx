/**
 * Hero mechanism — Iteration F placeholder SVG.
 *
 * <!-- ASSET-SWAP POINT #F1 -->
 *
 * Replaces with the Higgsfield engraving (am-006). When swapping in, you
 * MUST preserve element ids/classes so the scroll-bound state machine
 * (in globals.css) continues to drive it:
 *   - #center-wheel
 *   - .satellite
 *   - .satellite-rotor
 *   - .signal-line
 *   - .steady-glow
 *
 * F's schematic fills a TALLER, NARROWER box than C (full right half of
 * viewport, ~50vw × 100vh minus header band). Higgsfield art for F should
 * target ~560 × 760 viewBox or be generated in portrait. The current
 * placeholder still uses 540 × 460 with preserveAspectRatio="xMidYMid meet"
 * so it centers cleanly inside the taller box.
 */
export function HeroMechanismSvg() {
  return (
    <svg
      viewBox="0 0 540 460"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Schematic of Agentic Maison's Company Brain rendered as a watch movement; animates with scroll."
    >
      <defs>
        <pattern
          id="hatchF"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
          className="s-hatch"
        >
          <line x1="0" y1="0" x2="0" y2="6" strokeWidth="0.6" opacity="0.35" />
        </pattern>
      </defs>
      <g strokeWidth="1">
        {/* Outer rings */}
        <circle className="s-stroke" cx="270" cy="230" r="210" strokeDasharray="2 4" opacity="0.5" />
        <circle className="s-stroke" cx="270" cy="230" r="200" />
        <line className="s-stroke" x1="60" y1="230" x2="480" y2="230" strokeDasharray="3 5" opacity="0.45" />
        <line className="s-stroke" x1="270" y1="20" x2="270" y2="440" strokeDasharray="3 5" opacity="0.45" />

        {/* CENTER WHEEL */}
        <g id="center-wheel">
          <circle cx="270" cy="230" r="78" fill="url(#hatchF)" stroke="none" />
          <circle className="s-stroke" cx="270" cy="230" r="78" />
          <circle className="s-stroke" cx="270" cy="230" r="62" />
          <circle className="s-fill-pivot" cx="270" cy="230" r="6" />
          <g className="s-stroke" transform="translate(270 230)" strokeWidth="0.8">
            <rect x="-2.5" y="-86" width="5" height="8" />
            <g transform="rotate(22.5)"><rect x="-2" y="-86" width="4" height="6" opacity="0.7" /></g>
            <g transform="rotate(45)"><rect x="-2.5" y="-86" width="5" height="8" /></g>
            <g transform="rotate(67.5)"><rect x="-2" y="-86" width="4" height="6" opacity="0.7" /></g>
            <g transform="rotate(90)"><rect x="-2.5" y="-86" width="5" height="8" /></g>
            <g transform="rotate(112.5)"><rect x="-2" y="-86" width="4" height="6" opacity="0.7" /></g>
            <g transform="rotate(135)"><rect x="-2.5" y="-86" width="5" height="8" /></g>
            <g transform="rotate(157.5)"><rect x="-2" y="-86" width="4" height="6" opacity="0.7" /></g>
            <g transform="rotate(180)"><rect x="-2.5" y="-86" width="5" height="8" /></g>
            <g transform="rotate(202.5)"><rect x="-2" y="-86" width="4" height="6" opacity="0.7" /></g>
            <g transform="rotate(225)"><rect x="-2.5" y="-86" width="5" height="8" /></g>
            <g transform="rotate(247.5)"><rect x="-2" y="-86" width="4" height="6" opacity="0.7" /></g>
            <g transform="rotate(270)"><rect x="-2.5" y="-86" width="5" height="8" /></g>
            <g transform="rotate(292.5)"><rect x="-2" y="-86" width="4" height="6" opacity="0.7" /></g>
            <g transform="rotate(315)"><rect x="-2.5" y="-86" width="5" height="8" /></g>
            <g transform="rotate(337.5)"><rect x="-2" y="-86" width="4" height="6" opacity="0.7" /></g>
          </g>
        </g>

        {/* SATELLITES */}
        <g className="satellite" style={{ transformOrigin: "270px 70px" }}>
          <g className="satellite-rotor" style={{ transformOrigin: "270px 70px" }}>
            <circle className="s-fill-bg" cx="270" cy="70" r="38" />
            <circle className="s-stroke" cx="270" cy="70" r="38" />
            <circle className="s-stroke" cx="270" cy="70" r="26" strokeDasharray="2 3" />
            <circle className="s-fill-pivot" cx="270" cy="70" r="3" />
            <rect className="s-stroke" x="268" y="30" width="4" height="8" />
            <rect className="s-stroke" x="268" y="103" width="4" height="8" />
          </g>
        </g>
        <g className="satellite" style={{ transformOrigin: "430px 230px" }}>
          <g className="satellite-rotor" style={{ transformOrigin: "430px 230px" }}>
            <circle className="s-fill-bg" cx="430" cy="230" r="38" />
            <circle className="s-stroke" cx="430" cy="230" r="38" />
            <circle className="s-stroke" cx="430" cy="230" r="26" strokeDasharray="2 3" />
            <circle className="s-fill-pivot" cx="430" cy="230" r="3" />
          </g>
        </g>
        <g className="satellite" style={{ transformOrigin: "270px 390px" }}>
          <g className="satellite-rotor" style={{ transformOrigin: "270px 390px" }}>
            <circle className="s-fill-bg" cx="270" cy="390" r="38" />
            <circle className="s-stroke" cx="270" cy="390" r="38" />
            <circle className="s-stroke" cx="270" cy="390" r="26" strokeDasharray="2 3" />
            <circle className="s-fill-pivot" cx="270" cy="390" r="3" />
          </g>
        </g>
        <g className="satellite" style={{ transformOrigin: "110px 230px" }}>
          <g className="satellite-rotor" style={{ transformOrigin: "110px 230px" }}>
            <circle className="s-fill-bg" cx="110" cy="230" r="38" />
            <circle className="s-stroke" cx="110" cy="230" r="38" />
            <circle className="s-stroke" cx="110" cy="230" r="26" strokeDasharray="2 3" />
            <circle className="s-fill-pivot" cx="110" cy="230" r="3" />
          </g>
        </g>

        {/* SIGNAL LINES */}
        <line className="s-stroke signal-line live" x1="270" y1="152" x2="270" y2="108" strokeWidth="0.8" />
        <line className="s-stroke signal-line live" x1="348" y1="230" x2="392" y2="230" strokeWidth="0.8" />
        <line className="s-stroke signal-line live" x1="270" y1="308" x2="270" y2="352" strokeWidth="0.8" />
        <line className="s-stroke signal-line live" x1="192" y1="230" x2="148" y2="230" strokeWidth="0.8" />

        {/* STEADY-STATE GLOW */}
        <g className="steady-glow">
          <circle className="s-stroke" cx="270" cy="230" r="220" strokeDasharray="1 3" opacity="0.4" />
          <circle className="s-fill-pivot" cx="270" cy="152" r="2" />
          <circle className="s-fill-pivot" cx="348" cy="230" r="2" />
          <circle className="s-fill-pivot" cx="270" cy="308" r="2" />
          <circle className="s-fill-pivot" cx="192" cy="230" r="2" />
        </g>

        {/* Dimension lines */}
        <g className="s-stroke-dim" strokeWidth="0.6">
          <line x1="270" y1="32" x2="270" y2="20" />
          <line x1="262" y1="20" x2="278" y2="20" />
          <line x1="262" y1="32" x2="278" y2="32" />
          <line x1="468" y1="230" x2="480" y2="230" />
          <line x1="480" y1="222" x2="480" y2="238" />
          <line x1="468" y1="222" x2="468" y2="238" />
        </g>
      </g>

      <g fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="1">
        <text className="s-fill-dim" x="270" y="14" textAnchor="middle">A · WORKER</text>
        <text className="s-fill-dim" x="430" y="186" textAnchor="middle">B · WORKER</text>
        <text className="s-fill-dim" x="270" y="437" textAnchor="middle">C · WORKER</text>
        <text className="s-fill-dim" x="110" y="186" textAnchor="middle">D · WORKER</text>
      </g>

      <g fontFamily="Cormorant Garamond, serif" fontStyle="italic">
        <text className="s-fill-italic" x="270" y="220" textAnchor="middle" fontSize="14" fontWeight="600">The Company</text>
        <text className="s-fill-italic" x="270" y="240" textAnchor="middle" fontSize="14" fontWeight="600">Brain</text>
        <text className="s-fill-dim" x="270" y="256" textAnchor="middle" fontSize="9" fontStyle="normal" fontFamily="JetBrains Mono, monospace" letterSpacing="1.4">CAL. AM·01</text>
      </g>
    </svg>
  );
}
