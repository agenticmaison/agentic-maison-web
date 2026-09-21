# Chateau tour — handoff

Updated 2026-09-17. Workspace: `/Users/sean/agentic-maison/unshared/website`, branch `chateau-tour`. Read this, then `PRODUCTION-NOTE.md` in the same folder, before touching anything.

## Where things stand

Gates 1–6 are complete. The gate 7 build has had two review rounds. Round one (2026-09-16) is applied and committed. Round two (2026-09-21) is applied in the working tree: the Sales scene is cut, the copy blocks lost their eyebrow labels and CTAs, each scene's Next label is editable in `content.ts`, and the site's `SheetShell` header band is one row (wordmark, links, EN/ZH, Commission; the light/dark toggle and the clock are gone site-wide). The tour itself was tried inside the sheet and taken back out the same day: it is full-bleed with only the wordmark top-left. Three commits on `chateau-tour`, nothing pushed, nothing deployed, no Blob store.

The one open item from that review was frame sharpness. Sean upscaled the five clips to 4K, and on 2026-09-17 the delivery frames were re-extracted from them at 2560×1440, verified, and wired in. **That work is in the working tree and not committed**, because it replaces the 34 MB of tracked 720p frames with 92 MB and Sean has to decide whether that goes into git or into Vercel Blob. The manifests, tests, posters and docs are updated and all checks pass; the uncommitted state is one decision away from a commit. Details under "The 2K frame set" and "Next step".

Sean's standing instructions: work on the branch, commit only chateau files, do not deploy yet, ask before spending credits. Blob was "later"; the frame size now forces the question.

## Progress to date

| Date | What happened |
| --- | --- |
| 2026-09-10 to 09-15 | Style tile, visual story, stills and the five landscape clips generated and approved through gates 1–6. History in `HANDOFF-history-before-landscape-approval.md` and the plan's work log. |
| 2026-09-15 | Masters assembled (timebase-normalised), joins inspected, 937 delivery frames extracted at 18 fps, `/chateau` implemented, checked in headless Chromium, committed. Deliverables listed in `PRODUCTION-NOTE.md`. |
| 2026-09-16 | Review round one. Applied: pinned travel 1,400 → 820 vh; Skip tour removed; ink hero copy and ink wordmark over the light exterior, no scrim, animated scroll cue bottom-centre; room scrims anchored to the stage's bottom-left corner; a Next button in every copy block; per-scene focus points so portrait viewports keep the subject in frame. Committed. |
| 2026-09-17 | Upscale research (findings below). Sean upscaled the five clips through the Higgsfield app and dropped them in `~/Downloads`; copied under `clips/<scene>/upscale-4k/`. |
| 2026-09-17 | 4K clips verified against the masters frame by frame. 932 delivery frames extracted at 2560×1440 (92 MB), manifests and tests updated, posters regenerated, checks repeated, holds screenshotted (`assembly/shots/r3-*`). Not committed pending the hosting decision. |
| 2026-09-21 | Overseer regenerated at 1080p: still `stills/revision-09/` (dense screen wall, approved) and clip `clips/decision-support/pass-05/` (forward extension from the foyer tail, 120 credits). |
| 2026-09-21 | `web-015` done and approved: 504 AVIF frames at 12 fps, 37 MB, scene 04 from pass-05. Scroll cue removed and a menu added by Sean. Committed on `chateau-tour` and pushed; frames live in git, Blob not needed. |
| 2026-09-21 | `ops/prds/web-015` done: all four scenes re-extracted from the 4K upscales at 12 fps as AVIF (CRF 26), 504 frames, 35.9 MB, replacing the 753-frame 84 MB WebP set. Scene 04's segments authored from the new pass-05 footage; the other three rescaled by 12/18. AVIF capability gate added. Checks repeated. Still uncommitted, same hosting decision pending. |

## What the build does now

- Four scenes: exterior, foyer (The Company Brain), Decision Support (The Overseer), Insights. Sales is cut; the foyer's dark rear doorway cuts to the Overseer's near-black opening.
- No site chrome but the wordmark, fixed top-left, ink over the exterior and cream after. Full-viewport stage pinned at the top. No nav links, no locale toggle, no CTA on this page.
- One pinned 2D canvas, GSAP ScrollTrigger scrub, Lenis smoothing only. 670 vh of pinned travel: exterior 200, foyer 170, two rooms 150 each, one 30 vh still-frame hold per scene. Sean has not yet scrolled this pacing himself.
- Exterior copy is ink with no scrim. An animated mouse icon with "Scroll down" sits bottom-centre and fades over the first 15 vh. No Skip tour button: the tour is the website.
- Room copy sits on a scrim anchored to the bottom-left corner of the stage.
- A copy block with a `next` label has a button that scrolls to the point where the following scene's copy has fully entered. Exterior says "Enter the Maison", foyer "Go to the Overseer"; the Overseer and Insights have none. No eyebrow labels, no CTAs in the blocks. The contact section follows the footage with no button leading to it.
- Each scene declares a focus point so the cover crop keeps its subject in frame on portrait screens. A stopgap until the separately generated portrait clips (gate 8).
- Real DOM copy, a bounded prioritised frame loader, a reduced-motion stills layout and the site's contact form. The post-tour nav is gone; the wordmark links home.
- Frames live under `public/assets/chateau/frames/`. The committed set is 937 WebP at 1280×720, 34 MB, five scenes; the working tree holds a 504-frame 2560×1440 AVIF set for four scenes at 12 fps, 35.9 MB, uncommitted. There is no WebP fallback set: a browser that cannot decode AVIF gets the stills layout and fetches no frames. `FRAME_BASE` in `src/lib/chateau/content.ts` is the one place to change when Blob arrives.

Files: `src/lib/chateau/` (content, timeline with tests, frame loader), `src/app/[locale]/chateau/` (page, tour component, styles). `src/components/sheet-shell.tsx` changed in round two too, for the rest of the site, not for this route. Editing instructions are in `EDITING-GUIDE.md`.

## The 2K frame set

Sean produced the 4K clips in the Higgsfield web app; the provider, preset and credits spent were not recorded in this repo. Re-check the balance before assuming anything (last verified 341.5 credits, before the upscale).

Copied from `~/Downloads/<scene>-upscaled.mp4` to, relative to `designs/chateau/`:

| Scene | File | Decoded | Notes |
| --- | --- | --- | --- |
| 01 Exterior | `clips/exterior/upscale-4k/exterior-4k.mp4` | 3840×2160, 30 fps, 360 frames, 12.000 s | 31 MB |
| 02 Foyer | `clips/foyer/upscale-4k/foyer-4k.mp4` | 3840×2160, 30 fps, 299 frames, 9.967 s | 24 MB |
| 03 Sales (cut) | `clips/sales/upscale-4k/sales-4k.mp4` | 3840×2160, 30 fps, 299 frames, 9.967 s | 26 MB |
| 04 Decision Support | `clips/decision-support/upscale-4k/decision-support-4k.mp4` | 3840×2160, 30 fps, 299 frames, 9.967 s | 24 MB |
| 05 Insights | `clips/insights/upscale-4k/insights-4k.mp4` | 3840×2160, 30 fps, 299 frames, 9.967 s | 26 MB |

What was done with them on 2026-09-17:

- **Verified as the approved cuts.** Every 4K frame was matched against the master by mean absolute difference at 320×180. Each clip starts on master frame 0, ends on the master's last frame and follows the 0.8 frame mapping throughout; the upscaler retimed to 30 fps but neither trimmed nor padded. Framing is unchanged. First, middle and last frames were also compared by eye (contact sheets were made in a scratch folder, not kept).
- **Extracted at 18 fps, 2560×1440,** into a staging folder (since deleted) and copied over `public/assets/chateau/frames/`. The extraction line is in `PRODUCTION-NOTE.md`. Counts: exterior 216, each room 179 (the 30 fps retime is one frame short of 10 s). 92 MB in all, not the 140 MB estimated.
- **Manifests and tests updated.** `content.ts` now says 2560×1440, counts 216/179, last segment `to` 215/178; `timeline.test.ts` pinned 932 frames, now 753 after the Sales cut. Hold frames and copy beats are unchanged because they are time-based and the retime preserved time.
- **Posters regenerated** from the new frame 0000 (exterior) and each scene's hold frame, so they are 2560×1440 too. `01-exterior-hold.webp` is kept in step though nothing references it.
- **The originals stay untouched.** The 720p masters in the pass folders remain the approved reference; the 4K files are derivatives of them.

The 720p masters mix three timebases; concatenating them directly miscounts frames. Timebase-normalised copies are in `assembly/norm/`. Join findings are in `assembly/README.md`. With Sales cut, the live joins are exterior → foyer and Decision Support → Insights (continuous, dark) and foyer → Decision Support (the foyer's dark doorway to the Overseer's near-black opening, brightening over nine frames). Do not add fades.

Research from the morning of 2026-09-17, so it need not be redone: Higgsfield's MCP `upscale_video` has two providers, ByteDance (1080p/2K/4K, fps 24/30/60) and Topaz (1080p/2160p); neither exposes a cost preview; the price is shown only on the Upscale button in the logged-in app and is published nowhere. A video upscale is one job per clip, not per frame. `assembly/landscape-continuity-upload.mp4` is a smaller 720p re-encode of the 52 s assembly made for uploading.

## Next step

1. **Hosting, Sean's decision.** The working tree has 35.9 MB of frames against the 34 MB that is tracked — the 12 fps AVIF re-extract removed most of what made this a hard call. Mason recommended git and Sean has not answered yet. Either (a) commit them to git, which keeps the preview self-contained and grows the repo by about 60 MB net, or (b) Vercel Blob now: Sean creates the store in the Vercel dashboard and runs `vercel env pull` (the project currently has only `RESEND_API_KEY`), the frames are uploaded outside git, `FRAME_BASE` points at the Blob base URL and `public/assets/chateau/frames/` is removed. Do not commit the frames without that answer. The code, test, poster and doc changes commit either way.
2. Commit. `git add` only chateau paths plus the shell: `src/lib/chateau/`, `src/app/[locale]/chateau/`, `src/components/sheet-shell.tsx`, `src/components/mobile-menu.tsx`, `src/components/atelier-controls.tsx`, `src/app/globals.css`, `public/assets/chateau/` (if git was chosen), `designs/chateau/*.md`, `designs/chateau/assembly/README.md`, `designs/chateau/assembly/shots/r3-*` and `r4-*`, `ops/plans/chateau-tour.md`, `AGENTS.md`. The untracked media folders and the untracked `src/content/blog/` drafts stay out.
3. Hand Sean the local preview (`pnpm dev -p 3111`, then `/en/chateau`) for his third scroll pass. Unreviewed by a person: the sharper frames on a retina display, the 670 vh pacing and the foyer → Overseer cut.
4. Then gate 8, portrait.

## Decisions that still govern the work

- Warm daylight, limestone, oak, restrained brass. Door darkness comes from the footage, never an applied fade.
- Copy, headings and UI are DOM, never pixels. Ambient screens may be baked in.
- No CTA anywhere on the tour page; the contact section after the footage is the ask. Voice per the vault root `AGENTS.md`.
- Page metadata through `pageMetadata()`; no `openGraph` object in `src/app/`. The route is `noindex` until promotion.
- Portrait is separately generated 720×1280 at 18 fps with the same beats, swapped around 768 px. The landscape crop is not the portrait deliverable.
- Ask before any regeneration or purchase. No trial. Higgsfield only.

## Gates

7. Integrated landscape review with Sean. Round one done; a second scroll pass on the shortened pacing and the sharper frames is expected.
8. Portrait pass, after gate 7 is closed.
9. Promotion to `/`, explicit sign-off only.

## Verification done and not done

Done on every commit and again on the uncommitted state: `tsc`, `pnpm lint` (8 pre-existing warnings elsewhere), `pnpm test` (41 pass), `pnpm build`. Headless Chromium at 1440×900 after round two: full-viewport stage, loader unlocks, exterior, foyer and Overseer holds and the contact section rendered (`assembly/shots/r4-*.jpg`), 300 random fast jumps without a runtime error. The landing page's one-row header checked at 1440 and 390 wide; its schematic pane still sits at `--header-band-h`. Older sets: `r2-*` post-review at 720p, `r3-*` the 2K holds with five scenes.

Not done: a person scrolling with a wheel or a finger, a retina display (headless ran at DPR 1), Safari, Firefox, a real phone, throttled network, a Vercel preview, the tour at 390 wide since the Sales cut, forced reduced motion since the Sales cut. One thing to know about screenshots: `html` has `scroll-behavior: smooth`, so a `window.scrollTo` followed by a capture can land mid-animation and show the sticky band displaced; measure after settling, or wait longer.

Three traps already hit, so do not reintroduce them: an explicit `ImageBitmap` cache crashed the renderer under fast scrubbing; a component that pins with ScrollTrigger must be unmounted through a React-owned wrapper, or React throws on the node GSAP re-parented; and extracting AVIF frames with ffmpeg's image2 muxer (`-f image2 .../%04d.avif`) writes an empty `av1C` box, producing files that `file` and `ffprobe` accept and no browser will decode. Encode one AVIF per `-f avif` command. `PRODUCTION-NOTE.md` has the commands and the one-line check.

## Housekeeping

- Untracked and deliberately uncommitted: `designs/chateau/clips/` (masters and the 4K upscales, 567 MB, the source of every frame and backed up nowhere else) and `stills/` (107 MB). The staging frame sets, `_stage/` and the superseded 720p/2K extractions were deleted on 2026-09-21; `assembly/norm/` and the continuity previews are rebuildable from `clips/`.
- Modified and uncommitted: `public/assets/chateau/` (943 files), `src/lib/chateau/content.ts`, `src/lib/chateau/timeline.test.ts`, the chateau docs, `ops/plans/chateau-tour.md`.
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

"Continue from designs/chateau/HANDOFF.md on branch chateau-tour. Review round two (Sales cut, one-row site header, full-bleed tour) and the 2560×1440 frames are applied but uncommitted; the working tree is dirty on purpose. Get Sean's answer on git versus Blob for the 84 MB of frames, commit accordingly (chateau paths and the shell files only), then hand him the local preview for his third scroll pass. Do not deploy or generate portrait clips until Sean says so."
