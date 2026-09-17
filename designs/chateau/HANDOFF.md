# Chateau tour — handoff

Updated 2026-09-17. Workspace: `/Users/sean/agentic-maison/unshared/website`, branch `chateau-tour`. Read this, then `PRODUCTION-NOTE.md` in the same folder, before touching anything.

## Where things stand

Gates 1–6 are complete and the gate 7 build exists: the five approved landscape clips are assembled, extracted to 18 fps WebP and integrated as the scroll-driven route at `/chateau`. Sean reviewed it once on 2026-09-16 and every comment from that round is applied and committed. Two commits on `chateau-tour`, nothing pushed, nothing deployed, no Blob store.

The one open item from that review is **frame sharpness**. The frames look blurry on large and high-density screens because the masters are 720p and are drawn at 1.25× on a 1440 px window and 2.5× on a retina display. Neverland, the behavioural reference, draws 2560-wide frames on any window over 1280 px, which is why it looks sharp. The fix is to upscale the masters to 2K (2560×1440) and re-extract. That spends Higgsfield credits and is **not yet approved**. Details under "The upscale decision" below.

Sean's standing instructions from this round: Blob later, work on a branch, commit only chateau files, do not deploy yet.

## What the build does now

- One pinned 2D canvas, GSAP ScrollTrigger scrub, Lenis smoothing only. 820 vh of pinned travel: exterior 200, foyer 170, three rooms 150 each, one 30 vh still-frame hold per scene. Sean asked for less scrolling than the original 1,400 vh; this is the result and has not been re-reviewed by scrolling.
- Exterior copy is ink with no scrim; the wordmark turns ink while that scene is light. An animated mouse icon with "Scroll down" sits bottom-centre and fades over the first 15 vh. No Skip tour button: the tour is the website.
- Room copy sits on a scrim anchored to the bottom-left corner of the stage.
- Every copy block has a Next button that scrolls to the point where the following scene's copy has fully entered. The last one goes to the contact section.
- Each scene declares a focus point so the cover crop keeps its subject in frame on portrait screens. This is a stopgap until the separately generated portrait clips (gate 8).
- Real DOM copy, a selectable Telegram phone tracked onto the Sales projection by a hand-keyed perspective quad, a bounded prioritised frame loader, a reduced-motion stills layout, the site's contact form and a post-tour nav.
- Frames are committed under `public/assets/chateau/` (937 WebP, 34 MB) because Blob was deferred. `FRAME_BASE` in `src/lib/chateau/content.ts` is the one place to change when Blob arrives.

Files: `src/lib/chateau/` (content, timeline with tests, frame loader) and `src/app/[locale]/chateau/` (page, tour component, phone, styles). Editing instructions are in `EDITING-GUIDE.md`.

## The upscale decision

Facts established this session, so they need not be re-derived:

- Higgsfield's MCP `upscale_video` has two providers. Only ByteDance offers a 2K target (1080p, 2K, 4K; fps 24/30/60, above 30 doubles cost). Topaz Video offers 1080p or 2160p. So "2K" means ByteDance. Neither exposes a cost preview.
- A video upscale is one job per clip priced by model, resolution and duration. It is not per frame. Upscaling frames individually would be 937 jobs and would shimmer.
- Whether the price is per second or per job is **not published anywhere**. A researcher swept the help centre, blog, X, YouTube, review sites and the Topaz partnership coverage: the price only appears on the Upscale button in the logged-in app before confirming. Sean's question of whether one 52-second job is cheaper than five 10-second jobs cannot be answered from the web.
- Exterior, Decision Support and Insights can be upscaled straight from their job IDs (table below). Foyer and Sales are local assemblies and would need uploading first; earlier sessions found the upload route blocked. The assembled 52-second file is `assembly/landscape-continuity-preview.mp4`.
- Balance: 341.5 credits (verified 2026-09-16, unchanged since).

Two zero-cost ways to get the number: Sean reads the Upscale button in the web app for a 10-second clip and for the 52-second file, or an agent does the same through the browser on Sean's logged-in session without clicking Confirm. Sean has not chosen. Do not run an upscale until Sean says which clips and which provider.

After an upscale: re-extract at 18 fps from the upscaled masters (same ffmpeg line as in `PRODUCTION-NOTE.md`, no scale filter), update `width`/`height` in each manifest in `content.ts`, re-read the Sales plane corners only if the crop changed (fractions are resolution-independent, so normally not), and expect frames of roughly 2 to 3× the current 34 MB, which is the moment to move to Blob.

## Approved landscape masters — use exactly these

Paths relative to `designs/chateau/`. 1280×720, 24 fps, silent. Keep them unchanged.

| Order | Master | Frames / duration | Provenance |
| --- | --- | --- | --- |
| 01 Exterior | `clips/exterior/pass-01/exterior.mp4` | 289 / 12.04 s | Job `8d30317a-8524-466c-bdee-990ec81073e2` |
| 02 Foyer | `clips/foyer/pass-03/foyer.mp4` | 240 / 10 s | First 120 frames of pass-02 + tail job `4cef8f1b-f562-40bc-937c-3e2a452f2e11` |
| 03 Sales Ops | `clips/sales/pass-03/sales.mp4` | 240 / 10 s | Approved opening + extension job `81a2f4cb-35fb-421c-9928-60ccfbcee701` |
| 04 Decision Support | `clips/decision-support/pass-04/decision-support.mp4` | 240 / 10 s | Job `2298a07d-d1f3-492d-97c7-23b91b5e84e4` |
| 05 Insights | `clips/insights/pass-01/insights.mp4` | 240 / 10 s | Job `b2e00e03-f2cd-4933-a958-702593502a10` |

The masters mix three timebases; concatenating them directly miscounts frames. Timebase-normalised copies are in `assembly/norm/`. Join findings are in `assembly/README.md`: three joins continuous, Sales → Decision Support a hard cut from near-black, approved as is. Do not add fades.

## Decisions that still govern the work

- Warm daylight, limestone, oak, restrained brass. Door darkness comes from the footage, never an applied fade.
- Copy, headings, CTAs and UI are DOM, never pixels. Ambient screens may be baked in; the Sales projection carries the real phone.
- Primary CTA is "Discuss your workflow". Voice per the vault root `AGENTS.md`.
- Page metadata through `pageMetadata()`; no `openGraph` object in `src/app/`. The route is `noindex` until promotion.
- Portrait is separately generated 720×1280 at 18 fps with the same beats, swapped around 768 px. The landscape crop is not the portrait deliverable.
- Ask before any regeneration or purchase. No trial. Higgsfield only.

## Gates

7. Integrated landscape review with Sean. Round one done; a second scroll pass on the shortened pacing is expected, ideally after the upscale so blur does not dominate it.
8. Portrait pass, after gate 7 is closed.
9. Promotion to `/`, explicit sign-off only.

## Verification done and not done

Done on every commit: `tsc`, `pnpm lint` (8 pre-existing warnings elsewhere), `pnpm test` (44 pass), `pnpm build`. Headless Chromium at 1440×900 and 390×844: loader, holds, reverse and 300 random fast jumps, Next targets, forced reduced motion. Screenshots in `assembly/shots/` (`r2-*` are the post-review set).

Not done: a person scrolling with a wheel or a finger, Safari, Firefox, a real phone, throttled network, a Vercel preview.

Two traps already hit, so do not reintroduce them: an explicit `ImageBitmap` cache crashed the renderer under fast scrubbing; and a component that pins with ScrollTrigger must be unmounted through a React-owned wrapper, or React throws on the node GSAP re-parented.

## Housekeeping

- Untracked and deliberately uncommitted: `designs/chateau/clips/`, `stills/`, `frames-staging/`, `_stage/`, `assembly/norm/` and the continuity MP4, about 640 MB. Sean has not said whether to track them.
- The vault top level is closed. Playwright's MCP writes relative paths and its `.playwright-mcp/` folder to the vault root; use absolute paths for screenshots and delete that folder before finishing.
- Run the dev server on a spare port (`pnpm dev -p 3111`) and kill it and any leftover `next-server` before a production build.

## Suggested skills

- `unslop` at session start, as the Mason role requires.
- `next-best-practices` or `vercel:nextjs` before editing route code; the repo's `AGENTS.md` insists on reading `node_modules/next/dist/docs/` for this Next version.
- `claude-in-chrome` (or the Playwright MCP) for the scroll checks and, if Sean approves it, for reading the Upscale button price in the Higgsfield web app without confirming.
- `vercel:deploy` and `vercel:env-vars` only when Sean lifts the no-deploy instruction and the Blob store exists.
- `am-pm-authoring` if Sean wants gate 8 tracked as its own compact task under `ops/prds/`.

## Supporting documents

- `PRODUCTION-NOTE.md`: provenance, pacing table, loader design, checks, known limitations.
- `EDITING-GUIDE.md`: how to change copy and pacing.
- `assembly/README.md`: assembly and join inspection.
- `brief.txt`, `visual-story.md`, `style-tile.html`: the approved brief, story and style board. Later decisions above override where they differ.
- `ops/plans/chateau-tour.md`: phase plan and dated work log.
- `HANDOFF-history-before-landscape-approval.md`: archived notes from before clip approval.

## Suggested opening message to the next agent

"Continue from designs/chateau/HANDOFF.md on branch chateau-tour. The gate 7 build is done and reviewed once; all review comments are applied. The open item is upscaling the five 720p masters to 2K, which needs Sean's approval and a price he can only read from the Upscale button. Do not upscale, deploy or generate portrait clips until he says so."
