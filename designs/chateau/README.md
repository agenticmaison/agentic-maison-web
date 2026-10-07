# Chateau design review

Gate 1 approved by Sean. Gate 2 is also approved. Gate 3 revised stills with floating-copy previews are in `stills/revision-05/review.html`, with notes in `stills/revision-05/inspection.md`. Open `style-tile.html` directly in a browser. The board is editable HTML/CSS with embedded fonts and the unmodified SVG wordmark. Its three reference images now load from the adjacent stills folder; keep the folder with the board. It makes no external network requests.

## Brand pull

| Element | Source | Use |
|---|---|---|
| Dark wordmark | `../../../../company/brand/logo/svg/agentic-maison-wordmark-dark.svg` | Original outlined Radley letters, cream with brass diamond, embedded unchanged |
| Theme | `../../src/app/globals.css` | Dark paper #0e0d0a, paper 2 #161410, cream #ece4d3, secondary cream #c8bfaa, brass #b8895a, bright brass #d4a874 |
| Heading | `../../src/app/layout.tsx` | Cormorant Garamond 500 |
| Body | `../../src/app/layout.tsx` | Source Serif 4 400 |
| Labels | `../../src/app/layout.tsx` | JetBrains Mono 400 |
| Final route components | `../../src/components/wordmark.tsx` | Reuse the existing Wordmark component during integration |

Font bytes were taken from the existing Next development font cache and embedded in the board. The board uses the Latin subsets for its English specimens. The route will reuse the existing font configuration. `src/styles/brand.css` is explicitly a placeholder and was not used.

## Editing

Edit the CSS variables near the top of the board to explore color treatments. Typography, spacing and mobile layout are in the same style block. The HTML below holds all sample text and controls; CTA links deliberately point to the board's contact specimen. The embedded logo and fonts make this file portable.

The three imagery slots now show revised exterior, foyer and Sales Ops images. They await still approval. The copy composition is a blank spatial study, not generated architecture or final footage. The final site's copy, UI strings and manifest paths will live in its typed content.ts when implementation reaches that gate.

## Checks performed

- Read the live theme and font configuration; inspected the source wordmark with image vision.
- Higgsfield model listing and balance calls succeeded. Available credits: 10. No generation, regeneration, purchase or trial activation performed.
- FFmpeg 7.1.1 responds and includes libwebp.
- Checked board HTML structure, embedded assets, token values and internal anchor targets with a local parser.
- Vault structure check passed with existing warnings.

## Not performed

Browser rendering, desktop/mobile visual inspection and interaction checks. Agent-browser could not write its socket directory; the in-app browser then rejected the file URL under browser security policy. No workaround attempted after that rejection.

Five key stills have been generated; see the current inspection notes. No /chateau implementation, clip generation, live Neverland inspection, frame extraction, Blob upload, Vercel preview, lint, type-check, production build or scroll testing yet. Those belong to the later reviewed stages. Frame manifest paths and screen tracking cannot be verified until the media exists.

Fresh-agent context: `HANDOFF.md`. Insights revision-04 accepted; Decision Support revision-05 awaits review.
