/**
 * Plate II — AI Practice (Agentic Worker exploded view)
 * <!-- ASSET-SWAP POINT #F2 -->
 *
 * Hover state machine driven by CSS (.plate:hover .gear-cw / .signal / .live-only)
 * in globals.css. Preserves F's element classes.
 */
export function PlateAiSvg() {
  return (
    <svg viewBox="0 0 460 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern
          id="hatchF2"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
          className="s-hatch"
        >
          <line x1="0" y1="0" x2="0" y2="6" strokeWidth="0.5" opacity="0.32" />
        </pattern>
      </defs>
      <g strokeWidth="1">
        <line className="s-stroke" x1="20" y1="160" x2="440" y2="160" strokeDasharray="2 5" opacity="0.4" />
        <rect className="s-stroke" x="40" y="130" width="60" height="60" />
        <rect x="40" y="130" width="60" height="60" fill="url(#hatchF2)" stroke="none" opacity="0.5" />
        <line className="s-stroke signal" x1="100" y1="160" x2="155" y2="160" />
        <g className="gear gear-cw" style={{ transformOrigin: "195px 160px" }}>
          <circle className="s-fill-bg" cx="195" cy="160" r="42" />
          <circle className="s-stroke" cx="195" cy="160" r="42" />
          <circle className="s-stroke" cx="195" cy="160" r="32" strokeDasharray="2 3" />
          <circle className="s-fill-pivot" cx="195" cy="160" r="3" />
          <g className="s-stroke">
            <rect x="193" y="113" width="4" height="8" />
            <rect x="193" y="199" width="4" height="8" />
            <rect x="148" y="158" width="8" height="4" />
            <rect x="234" y="158" width="8" height="4" />
          </g>
        </g>
        <line className="s-stroke signal" x1="237" y1="160" x2="295" y2="160" />
        <rect className="s-stroke" x="295" y="130" width="80" height="60" />
        <line className="s-stroke" x1="295" y1="148" x2="375" y2="148" strokeDasharray="2 3" opacity="0.6" />
        <line className="s-stroke" x1="295" y1="170" x2="375" y2="170" strokeDasharray="2 3" opacity="0.6" />
        <line className="s-stroke signal" x1="375" y1="160" x2="410" y2="160" />
        <polygon className="s-stroke" points="410,160 440,140 440,180" />
      </g>
      <g fontFamily="JetBrains Mono, monospace" fontSize="8" letterSpacing="1">
        <text className="s-fill-dim" x="70" y="220" textAnchor="middle">a · TRIGGER</text>
        <text className="s-fill-dim" x="195" y="220" textAnchor="middle">b · REASONER</text>
        <text className="s-fill-dim" x="335" y="220" textAnchor="middle">c · TOOL BUS</text>
        <text className="s-fill-dim" x="425" y="220" textAnchor="middle">d · OUT</text>
      </g>
      <g fontFamily="Cormorant Garamond, serif" fontStyle="italic">
        <text className="s-fill-italic" x="230" y="270" textAnchor="middle" fontSize="16" fontWeight="600">Agentic Worker</text>
      </g>
    </svg>
  );
}

/**
 * Plate III — Digital Practice (Site as Building section)
 * <!-- ASSET-SWAP POINT #F3 -->
 */
export function PlateDigitalSvg() {
  return (
    <svg viewBox="0 0 460 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern
          id="hatchF3"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
          className="s-hatch"
        >
          <line x1="0" y1="0" x2="0" y2="6" strokeWidth="0.5" opacity="0.32" />
        </pattern>
      </defs>
      <g strokeWidth="1">
        <line className="s-stroke" x1="30" y1="270" x2="430" y2="270" />
        <rect x="50" y="240" width="360" height="30" fill="url(#hatchF3)" stroke="none" />
        <line className="s-stroke" x1="50" y1="240" x2="410" y2="240" />
        <line className="s-stroke" x1="50" y1="200" x2="410" y2="200" />
        <line className="s-stroke" x1="50" y1="160" x2="410" y2="160" />
        <line className="s-stroke" x1="50" y1="120" x2="410" y2="120" />
        <line className="s-stroke" x1="50" y1="120" x2="50" y2="240" />
        <line className="s-stroke" x1="410" y1="120" x2="410" y2="240" />
        <line className="s-stroke" x1="140" y1="120" x2="140" y2="240" strokeDasharray="2 3" />
        <line className="s-stroke" x1="230" y1="120" x2="230" y2="240" strokeDasharray="2 3" />
        <line className="s-stroke" x1="320" y1="120" x2="320" y2="240" strokeDasharray="2 3" />
        <polygon className="s-stroke" points="50,120 230,80 410,120" />
        <g className="live-only">
          <rect x="55" y="124" width="80" height="32" fill="url(#hatchF3)" opacity="0.6" />
          <rect x="235" y="164" width="80" height="32" fill="url(#hatchF3)" opacity="0.6" />
          <rect x="55" y="204" width="170" height="32" fill="url(#hatchF3)" opacity="0.45" />
          <rect x="325" y="204" width="80" height="32" fill="url(#hatchF3)" opacity="0.6" />
        </g>
      </g>
      <g fontFamily="JetBrains Mono, monospace" fontSize="8">
        <text className="s-fill-italic" x="65" y="143" fontSize="9">FACADE</text>
        <text className="s-fill-italic" x="65" y="183" fontSize="9">CONTENT</text>
        <text className="s-fill-italic" x="65" y="223" fontSize="9">SYSTEM</text>
      </g>
      <g fontFamily="Cormorant Garamond, serif" fontStyle="italic">
        <text className="s-fill-italic" x="230" y="298" textAnchor="middle" fontSize="16" fontWeight="600">Site as Building</text>
      </g>
    </svg>
  );
}
