# Chateau tour — implementation handoff

Updated 2026-09-15, after the gate 7 build. Workspace: `/Users/sean/agentic-maison/unshared/website`.

## Current status and next action

**Gate 7 build is done and awaits Sean's scroll review.** The five approved masters are assembled, the 18 fps delivery frames are extracted and verified, and the scroll-driven `/chateau` route is implemented on the branch `chateau-tour`. Sean asked that Blob hosting be deferred and that no Vercel deployment be made yet, so the frames are committed under `public/assets/chateau/` and the review runs locally with `pnpm dev`, at `/en/chateau`. The next action is Sean's review of pacing, copy timing and the Sales phone; after that, tune, then portrait (gate 8).

What exists now, all under this repo:

- `designs/chateau/PRODUCTION-NOTE.md` — provenance, sizes, measured pacing, checks performed and not performed, known limitations. Read this first.
- `designs/chateau/EDITING-GUIDE.md` — how to change copy and pacing.
- `designs/chateau/assembly/` — continuity preview MP4, join inspection, per-scene contact sheets, browser screenshots (`shots/`). Notes in its README.
- `src/lib/chateau/` — typed content, pure timeline with tests, frame loader.
- `src/app/[locale]/chateau/` — the page, the tour component, the phone, the styles.

Not done: Vercel Blob hosting, any deployment, portrait generation, promotion to `/`. Do not regenerate approved media.

## Approved landscape masters — use exactly these

Paths are relative to `designs/chateau/`. All files exist and were decoded with ffprobe at handoff: 1280×720, 24 fps, silent. Keep original files unchanged. Total source timeline before trims: 52.041667 seconds / 1,249 frames.

| Order | Approved full master | Decoded frames / duration | Provenance |
| --- | --- | --- | --- |
| 01 Exterior | `clips/exterior/pass-01/exterior.mp4` | 289 / 12.041667 s | Job `8d30317a-8524-466c-bdee-990ec81073e2` |
| 02 Foyer | `clips/foyer/pass-03/foyer.mp4` | 240 / 10 s | Assembly: first 120 frames of pass-02 + corrected tail job `4cef8f1b-f562-40bc-937c-3e2a452f2e11` |
| 03 Sales Ops | `clips/sales/pass-03/sales.mp4` | 240 / 10 s | Assembly: approved opening + extension job `81a2f4cb-35fb-421c-9928-60ccfbcee701` |
| 04 Decision Support | `clips/decision-support/pass-04/decision-support.mp4` | 240 / 10 s | Job `2298a07d-d1f3-492d-97c7-23b91b5e84e4`, approved silver seated robot |
| 05 Insights | `clips/insights/pass-01/insights.mp4` | 240 / 10 s | Job `b2e00e03-f2cd-4933-a958-702593502a10`, approved standing robot and holograms |

Each directory has `review.html`, `inspection.md` and generation records. **Use full Foyer and Sales masters, not departure.mp4, tail.mp4 or extended.mp4 alone.** Decision Support pass-02, its local transition-edit, and pass-03 are superseded. Do not reintroduce their fades.

## Immediate assembly and implementation workflow

1. Read `brief.txt`, `visual-story.md`, `.impeccable.md`, the repository AGENTS.md and the brand guidance it references. Latest decisions here override older storyboard and brief details where explicitly identified below. Read relevant `node_modules/next/dist/docs/` before writing Next.js code.
2. Assemble a new, separately named landscape review MP4 in scene order, preserving approved masters. This review video may use a video element; the delivered tour must use a canvas. Normalize timestamps and inspect all four joins in forward and reverse playback. Do not silently crop, retime or add fades to repair approved footage. Document any proposed boundary trim and its source frame indices. Do not require a separate planning approval merely to perform authorized assembly and integration.
3. Inspect source beats and choose exact entry, reading-hold and exit frame ranges. A single continuous MP4 is useful for review but production can retain per-scene sequences on one logical timeline. Keep rooms additive.
4. Extract 18 fps WebP sequences into fresh staging folders per scene, preserving masters at 24 fps. Starting target: 1280×720, quality 78, no upscale. Verify actual decoded counts, contiguous zero-based numbering, dimensions, file sizes and first/middle/last samples. Do not trust old near-end screenshots as exact endpoints. Foyer has exactly 240 decoded frames despite older metadata ambiguity.
5. Host delivery frames on Vercel Blob, outside git, with verified per-scene manifests (count, dimensions, naming pattern, poster and base URL). Follow existing repository deployment/access rules; do not purchase anything or expose credentials. Local staged frames can support development while hosting access is resolved.
6. Build `/chateau` using one pinned 2D canvas, GSAP ScrollTrigger, Lenis and real accessible HTML copy/overlays. Implement piecewise scroll-to-frame mapping, including deliberate still-frame reading holds. Review pacing against actual footage.
7. Run required checks and present the integrated Vercel preview for Sean's scroll review. Stop at gate 7 for feedback. Then separately generated portrait production/review is gate 8. Promotion to `/` is gate 9 and requires explicit approval.

## Latest visual and transition decisions

- Warm late-afternoon daylight, limestone, dark oak and restrained brass. No eerie dusk or green/teal film grade.
- **Door darkness is caused by close approach and camera passage through a stationary closed door, not an applied fade.** Sean explicitly rejected fade-in/fade-out prompts. The camera should remain in forward motion at the dark endpoint. This is a deliberate cinematic illusion, not a requirement for the door to physically open.
- Approved sources have imperfections: Sales ends black; Decision Support and Insights start with the room already visible. Their final frames show very dark oak with faint reflection/detail rather than uniform black. Sean reviewed and approved these clips. Inspect joins in the assembly, report limitations, and do not automatically spend credits fixing them.
- Exterior: distant chateau low-right, high opening, roughly 75% sky. Floating hero text near the middle-left; remove “AI Consultancy · Hong Kong” eyebrow.
- Foyer: physically supported large company-brain sphere, visible wiring. Approved entry turns LEFT; departure goes around RIGHT of the brain through the single rear oak door farthest from the left windows. Do not use rejected two-door/left-departure versions.
- Sales: large blank wall projection remains for a real HTML iPhone/Telegram Sales Ops demo. Track the projection perspective and preserve a readable hold.
- Decision Support: approved silver fully mechanical seated robot; colour televisions show trucks, factories, warehouses, shops and offices. No charts or graphs on those screens. Older gold/brass and human-faced robot variants are superseded.
- Insights: approved revision-04 composition; robot stands close to the console and gestures. Bright populated charts/graphs/diagrams float at different depths across LEFT, CENTRE and RIGHT. No blank central screen. A side exit appears outside the close reading composition. The original brief's blank central Insights HTML-screen requirement is superseded; its analytics may be baked into the footage.
- Floating text overlays the background on BOTH desktop and mobile, never below the image/video. Use a restrained local scrim if needed; do not erase left-side holograms to make a text wall.
- Final exit leads to the CTA, with no exterior bookend and no page content between rooms.

## Approved still references

All under `designs/chateau/`, 2688×1520 PNG. Use if later portrait generation requires references.

| Scene | Still | Higgsfield job |
| --- | --- | --- |
| Exterior | `stills/revision-02/scene-01-exterior.png` | `754cd62b-04c6-4d78-bcec-4628e16226e5` |
| Foyer | `stills/revision-01/scene-02-foyer.png` | `4dd80be6-a861-4d26-b773-5b749f4210ca` |
| Sales | `stills/revision-01/scene-03-sales-ops.png` | `63bc2ff9-625c-40df-816d-2d627116e3c1` |
| Decision Support | `stills/revision-08/scene-04-decision-support.png` | `f1681c33-7096-4f4b-b8ed-2c1fc9892f25` |
| Insights | `stills/revision-04/scene-05-insights.png` | `e62b8c59-b52a-4868-a308-965fecc83087` |

## Runtime, content and brand requirements

- Existing Next.js repository; route `/chateau` first. Use `pageMetadata()` from `src/lib/metadata/page-metadata.ts`; never declare an `openGraph` object inside `src/app/`.
- One pinned 2D canvas. No Three.js, Blender or autoplay video in the final experience. Native scrolling, forward/reverse scrubbing; Lenis smooths rather than hijacks scrolling.
- Approved initial pacing: exterior 300 CSS vh, foyer 250 vh, each of three rooms 200 vh, plus five 50 vh holds = 1,400 CSS vh pinned travel. These are scroll distances, not clip seconds. Tune in integrated review; never stretch too few frames over a long move.
- Real selectable DOM headings, copy, navigation, CTA and Sales demo. Typed `content.ts` owns copy/UI strings/manifests. Primary CTA: “Discuss your workflow”. Tour chrome is original logo + Skip tour; full nav comes after the tour.
- Preserve actual wordmark. Palette: #0e0d0a, #ece4d3, #b8895a/#d4a874, ink #14110b. Cormorant Garamond headings, Source Serif 4 body, JetBrains Mono small labels; confirm actual repo tokens/assets.
- AI consultancy is primary; digital services auxiliary. Brand vocabulary/tone: repository AGENTS references vault-level and AI-practice instructions. Do not expose internal service doctrine.
- Immediate poster, branded scene-one loader, progressive later-scene loading. Prioritize requested frame and neighbours, bound concurrency and decoded-memory cache, release evicted bitmaps, cancel obsolete work, bounded retries and usable failure fallback.
- Handle fast jumps, reverse scroll, resizing, DPR and teardown. Hidden overlays must not receive focus or intercept clicks. Reduced motion shows scene stills with copy and usable CTA/nav.
- Portrait delivery is separately generated 720×1280 at 18 fps, same cut/copy beats, responsive swap around 768 px. A temporary landscape crop for integration is not the final portrait deliverable.

## Authorization, tooling and verification limits

All landscape masters are approved. Assembly and integrated preview are next authorized work. **Ask before any regeneration or purchase.** Do not start a trial, spend repeatedly on retries, generate portrait early, or promote the homepage. No new generations are currently pending. Last verified Higgsfield balance: **341.5 credits** after Insights pass-01 (65 credits).

For future authorized generation, use Higgsfield only. Check live model schema and exact cost, save job IDs immediately and retrieve existing jobs before resubmission. Completed job UUIDs can be references. Current successful video mode: Seedance 2.5 forward video_extension with video + approved still, 10 seconds, 720p, audio false, high bitrate. Returns the new segment only. Single-generation widget updates automatically; do not duplicate display. Respect jobs_wait poll intervals.

Latest downloads succeeded via approved curl calls. Earlier sessions had browser file-URL and upload restrictions; do not bypass a rejection through another browser, URL or tool. If new access is blocked, explain the exact blocker and continue independent local work. Do not place signed URLs or credentials in records.

Agent media checks were chronological still samples, exact endpoints, metadata and decoded-frame counts, not full real-time playback. Sean personally reviewed and approved clips. Browser rendering, combined continuity and runtime scroll smoothness remain unverified. No lint/typecheck/build was run for this handoff-only task. Implementation must run them and exercise desktop/mobile, reverse scroll, transitions, loader/failures and reduced motion. Repository builds fetch Google fonts; retry a network-related failed build before debugging code.

Deliverables after implementation: `/chateau` Vercel preview, approved source assets, typed content and manifests, two-paragraph editing guide, production note with provenance, sizes, measured pacing and known limitations. Preserve unrelated work; no commit or deployment was performed by this handoff task.

## Supporting documents

- `designs/chateau/brief.txt`: complete original brief; latest overrides above apply.
- `designs/chateau/visual-story.md`: approved story/copy/pacing baseline.
- `designs/chateau/style-tile.html`: approved editable style and brand board.
- `ops/plans/chateau-tour.md`: project phase plan.
- `designs/chateau/HANDOFF-history-before-landscape-approval.md`: archived historical notes; contains obsolete next steps. This current document is authoritative.

## Suggested opening message to the next agent

“Continue from designs/chateau/HANDOFF.md. All five landscape clips are approved. Assemble them in the documented order, inspect the joins, and implement the canvas-based scroll tour at /chateau for the integrated Vercel preview review. Preserve approved masters and the latest no-fade doorway direction. Do not regenerate, produce portrait clips or promote the homepage yet.”
