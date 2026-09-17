# Chateau tour — handoff

Updated 2026-09-17. Workspace: `/Users/sean/agentic-maison/unshared/website`, branch `chateau-tour`. Read this, then `PRODUCTION-NOTE.md` in the same folder, before touching anything.

## Where things stand

Gates 1–6 are complete. The gate 7 build exists and has been reviewed once: the five approved landscape clips are assembled, extracted to 18 fps WebP and integrated as the scroll-driven route at `/chateau`. Every comment from Sean's 2026-09-16 review is applied and committed. Three commits on `chateau-tour`, nothing pushed, nothing deployed, no Blob store.

The one open item from that review was frame sharpness: the masters are 720p and are drawn at 1.25× on a 1440 px window and 2.5× on a retina display. **Sean has now upscaled all five clips himself** (2026-09-17). The next task is to re-extract the delivery frames from them, which changes the frame files, the manifests and the hosting question. Details under "The upscaled clips" and "Next step".

Sean's standing instructions: Blob later (but see below, the upscale forces the question), work on the branch, commit only chateau files, do not deploy yet, ask before spending credits.

## Progress to date

| Date | What happened |
| --- | --- |
| 2026-09-10 to 09-15 | Style tile, visual story, stills and the five landscape clips generated and approved through gates 1–6. History in `HANDOFF-history-before-landscape-approval.md` and the plan's work log. |
| 2026-09-15 | Masters assembled (timebase-normalised), joins inspected, 937 delivery frames extracted at 18 fps, `/chateau` implemented, checked in headless Chromium, committed. Deliverables listed in `PRODUCTION-NOTE.md`. |
| 2026-09-16 | Review round one. Applied: pinned travel 1,400 → 820 vh; Skip tour removed; ink hero copy and ink wordmark over the light exterior, no scrim, animated scroll cue bottom-centre; room scrims anchored to the stage's bottom-left corner; a Next button in every copy block; per-scene focus points so portrait viewports keep the subject in frame. Committed. |
| 2026-09-17 | Upscale research (findings below). Sean upscaled the five clips through the Higgsfield app and dropped them in `~/Downloads`; they are now copied under `clips/<scene>/upscale-4k/`. Nothing has been extracted from them yet. |

## What the build does now

- One pinned 2D canvas, GSAP ScrollTrigger scrub, Lenis smoothing only. 820 vh of pinned travel: exterior 200, foyer 170, three rooms 150 each, one 30 vh still-frame hold per scene. Sean has not yet scrolled this shortened pacing himself.
- Exterior copy is ink with no scrim; the wordmark turns ink while that scene is light. An animated mouse icon with "Scroll down" sits bottom-centre and fades over the first 15 vh. No Skip tour button: the tour is the website.
- Room copy sits on a scrim anchored to the bottom-left corner of the stage.
- Every copy block has a Next button that scrolls to the point where the following scene's copy has fully entered. The last one goes to the contact section.
- Each scene declares a focus point so the cover crop keeps its subject in frame on portrait screens. A stopgap until the separately generated portrait clips (gate 8); on a phone the Sales copy still overlaps the phone.
- Real DOM copy, a selectable Telegram phone tracked onto the Sales projection by a hand-keyed perspective quad (fractions of the frame, so resolution-independent), a bounded prioritised frame loader, a reduced-motion stills layout, the site's contact form and a post-tour nav.
- Frames are committed under `public/assets/chateau/` (937 WebP at 1280×720, 34 MB). `FRAME_BASE` in `src/lib/chateau/content.ts` is the one place to change when Blob arrives.

Files: `src/lib/chateau/` (content, timeline with tests, frame loader) and `src/app/[locale]/chateau/` (page, tour component, phone, styles). Editing instructions are in `EDITING-GUIDE.md`.

## The upscaled clips

Sean produced these in the Higgsfield web app; the provider, preset and credits spent were not recorded in this repo. Re-check the balance before assuming anything (last verified 341.5 credits, before the upscale).

Copied from `~/Downloads/<scene>-upscaled.mp4` to, relative to `designs/chateau/`:

| Scene | File | Decoded | Notes |
| --- | --- | --- | --- |
| 01 Exterior | `clips/exterior/upscale-4k/exterior-4k.mp4` | 3840×2160, 30 fps, 360 frames, 12.000 s | 31 MB |
| 02 Foyer | `clips/foyer/upscale-4k/foyer-4k.mp4` | 3840×2160, 30 fps, 299 frames, 9.967 s | 24 MB |
| 03 Sales | `clips/sales/upscale-4k/sales-4k.mp4` | 3840×2160, 30 fps, 299 frames, 9.967 s | 26 MB |
| 04 Decision Support | `clips/decision-support/upscale-4k/decision-support-4k.mp4` | 3840×2160, 30 fps, 299 frames, 9.967 s | 24 MB |
| 05 Insights | `clips/insights/upscale-4k/insights-4k.mp4` | 3840×2160, 30 fps, 299 frames, 9.967 s | 26 MB |

Three things to know before using them:

- **They are 4K, not 2K,** and **30 fps, not 24.** The upscaler retimed the footage. Frame counts therefore differ from the masters (289/240 at 24 fps became 360/299 at 30 fps), and the four 10-second clips are one 30 fps frame short of 10 s. Extracting at 18 fps should still give 216 exterior frames and 179 or 180 per room; verify the decoded counts and adjust each manifest's `count` and the last segment's `to` in `content.ts` if a room comes out at 179.
- **Confirm they are the approved cuts.** Compare first, middle and last frames of each 4K clip against the master (`assembly/norm/0N-<scene>.mp4`) before extracting; an upscaler that trimmed or padded a frame at either end would shift the beat frames. Do not re-read the Sales plane corners unless the framing changed; the keys are fractions.
- **The originals stay untouched.** The 720p masters in the pass folders remain the approved reference; the 4K files are derivatives of them.

The 720p masters mix three timebases; concatenating them directly miscounts frames. Timebase-normalised copies are in `assembly/norm/`. Join findings are in `assembly/README.md`: three joins continuous, Sales → Decision Support a hard cut from near-black, approved as is. Do not add fades.

Research from the morning of 2026-09-17, so it need not be redone: Higgsfield's MCP `upscale_video` has two providers, ByteDance (1080p/2K/4K, fps 24/30/60) and Topaz (1080p/2160p); neither exposes a cost preview; the price is shown only on the Upscale button in the logged-in app and is published nowhere. A video upscale is one job per clip, not per frame. `assembly/landscape-continuity-upload.mp4` is a smaller 720p re-encode of the 52 s assembly made for uploading.

## Next step

1. Verify the 4K clips against the masters (above).
2. Choose the delivery size. 4K frames would be roughly 9× the current bytes and are more than any viewport needs. **Recommend 2560×1440**, the size the behavioural reference (neverland.agency) serves on windows over 1280 px. Extract with the production-note ffmpeg line plus `scale=2560:-2` (downscale only), quality 78, into fresh `frames-staging-2k/<scene>/` folders. Expect about 4× the current 34 MB, so roughly 140 MB.
3. Verify counts, numbering, dimensions and first/middle/last samples; update `width`, `height` and, if needed, `count` in each manifest; regenerate the posters from the hold frames; run `pnpm test` (the timeline tests pin counts and totals).
4. **Hosting.** 140 MB of frames should not go into git. This is the moment for Vercel Blob: Sean creates the store in the Vercel dashboard and runs `vercel env pull` (the project currently has only `RESEND_API_KEY`), then upload the frames outside git, set `FRAME_BASE` to the Blob base URL and remove `public/assets/chateau/frames/`. If Sean wants to keep deferring Blob, say the number and let him decide; do not commit 140 MB silently.
5. Re-run the browser checks at 1440×900 with DPR 2 and confirm the softness is gone, then hand Sean the local preview for his second scroll pass (the shortened pacing is also unreviewed by hand).
6. Then gate 8, portrait.

## Decisions that still govern the work

- Warm daylight, limestone, oak, restrained brass. Door darkness comes from the footage, never an applied fade.
- Copy, headings, CTAs and UI are DOM, never pixels. Ambient screens may be baked in; the Sales projection carries the real phone.
- Primary CTA is "Discuss your workflow". Voice per the vault root `AGENTS.md`.
- Page metadata through `pageMetadata()`; no `openGraph` object in `src/app/`. The route is `noindex` until promotion.
- Portrait is separately generated 720×1280 at 18 fps with the same beats, swapped around 768 px. The landscape crop is not the portrait deliverable.
- Ask before any regeneration or purchase. No trial. Higgsfield only.

## Gates

7. Integrated landscape review with Sean. Round one done; a second scroll pass on the shortened pacing and the sharper frames is expected.
8. Portrait pass, after gate 7 is closed.
9. Promotion to `/`, explicit sign-off only.

## Verification done and not done

Done on every commit: `tsc`, `pnpm lint` (8 pre-existing warnings elsewhere), `pnpm test` (44 pass), `pnpm build`. Headless Chromium at 1440×900 and 390×844: loader, holds, reverse and 300 random fast jumps, Next targets, forced reduced motion. Screenshots in `assembly/shots/` (`r2-*` are the post-review set).

Not done: a person scrolling with a wheel or a finger, Safari, Firefox, a real phone, throttled network, a Vercel preview, anything at all with the 4K clips.

Two traps already hit, so do not reintroduce them: an explicit `ImageBitmap` cache crashed the renderer under fast scrubbing; and a component that pins with ScrollTrigger must be unmounted through a React-owned wrapper, or React throws on the node GSAP re-parented.

## Housekeeping

- Untracked and deliberately uncommitted: `designs/chateau/clips/` (now including the five 4K files, 131 MB), `stills/`, `frames-staging/`, `_stage/`, `assembly/norm/` and the two continuity MP4s, about 780 MB in all. Sean has not said whether to track them; the 4K files are also still in `~/Downloads`.
- The vault top level is closed. Playwright's MCP writes relative paths and its `.playwright-mcp/` folder to the vault root; use absolute paths for screenshots and delete that folder before finishing.
- Run the dev server on a spare port (`pnpm dev -p 3111`) and kill it and any leftover `next-server` before a production build.
- Prettier is not configured in the repo; the tour files use single quotes like the rest of `src/`. If you run Prettier, pass `--single-quote`.

## Suggested skills

- `unslop` at session start, as the Mason role requires.
- `next-best-practices` or `vercel:nextjs` before editing route code; the repo's `AGENTS.md` insists on reading `node_modules/next/dist/docs/` for this Next version.
- `vercel:vercel-storage` and `vercel:env-vars` when setting up the Blob store and pulling its token.
- `claude-in-chrome` (or the Playwright MCP) for the scroll checks.
- `vercel:deploy` only when Sean lifts the no-deploy instruction.
- `am-pm-authoring` if Sean wants gate 8 tracked as its own compact task under `ops/prds/`.

## Supporting documents

- `PRODUCTION-NOTE.md`: provenance, pacing table, loader design, checks, known limitations.
- `EDITING-GUIDE.md`: how to change copy and pacing.
- `assembly/README.md`: assembly and join inspection.
- `brief.txt`, `visual-story.md`, `style-tile.html`: the approved brief, story and style board. Later decisions above override where they differ.
- `ops/plans/chateau-tour.md`: phase plan and dated work log.
- `HANDOFF-history-before-landscape-approval.md`: archived notes from before clip approval.

## Suggested opening message to the next agent

"Continue from designs/chateau/HANDOFF.md on branch chateau-tour. The gate 7 build is reviewed once and all comments are applied. Sean has upscaled the five clips to 4K at 30 fps; they are under designs/chateau/clips/<scene>/upscale-4k/. Verify them against the masters, re-extract 18 fps delivery frames at 2560×1440, update the manifests, and raise Blob hosting before committing frames. Do not deploy or generate portrait clips until Sean says so."
