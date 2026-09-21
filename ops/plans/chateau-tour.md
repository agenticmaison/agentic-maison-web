# Plan: Chateau tour

## Objective

Build the /chateau route as a scroll-scrubbed cinematic tour in the existing Next.js site, following Sean's complete brief at `designs/chateau/brief.txt`.

## Status

Gates 1–6 complete; the gate 7 build is done on branch `chateau-tour` and awaits Sean's scroll review. Blob hosting and the Vercel preview are deferred at Sean's request; review runs locally. Canonical context: `designs/chateau/HANDOFF.md` and `designs/chateau/PRODUCTION-NOTE.md`. Last verified balance: 341.5 credits. Portrait follows integrated review; homepage promotion requires explicit approval.

## Project context

Project prefix: web. Working path: repository root.

## Scope

Included: brand pull, editable style tile, storyboard and piecewise pacing, landscape stills and clips in scene order, single canvas implementation, real HTML hero screens, progressive bounded loading, accessible fallbacks, Blob manifests, Vercel preview and portrait pass.

Excluded: logo redesign, alternate generation providers, Blender, Three.js, video elements, CMS, paid purchases without approval, regeneration without approval, and production promotion without explicit sign-off.

## Phase plan

1. Review style tile and brand pull.
2. Review Visual Story table and scroll pacing plan with real draft copy.
3. Generate and review key stills per scene. Add three selected references to the style tile.
4. Generate and review exterior clip.
5. Generate and review foyer clip.
6. Generate and review Sales Ops room, Decision Support room and Insights room individually, in that order.
7. Integrate the approved landscape media into /chateau on Vercel preview and scroll-test with Sean.
8. Generate the portrait pass after all landscape scenes are approved, then verify matching beats and responsive swap.
9. Promote to / only on explicit sign-off.

## Current work

`ops/prds/web-012-chateau-style-tile.md` records the approved first gate. `ops/prds/web-013-chateau-story-pacing.md` records approved gate 2. `ops/prds/web-014-chateau-key-stills.md` covers the current still-generation stage. Author later implementation briefs after their inputs are reviewed.

## Risks and assumptions

Higgsfield has 978 available credits after the first pass and one authorized revision per scene. This does not establish sufficient credit for the full production. Check each model's live schema before each job, retain job IDs and retrieve results before resubmission. Ask before any regeneration or purchase.

Sean approved the pacing interpretation: 300 CSS vh for three viewport heights, 250 vh for the foyer, 200 vh per room and an additional 50 vh readable hold in each scene. Total pinned travel is 1,400 CSS vh.

Hero-screen overlays require stable, trackable screen planes throughout the approved camera motion. Inspect that explicitly before accepting a clip.

## Deferred

All later gates await approval of the preceding gate. Three first-pass imagery specimens are in the style tile; revised selections await approval. No competing aesthetic directions are needed because Sean supplied the architectural concept and required preservation of the brand.

## Work log

2026-09-10: Saved the full brief, created the portable HTML style tile and recorded provenance. Browser verification is blocked by the file-URL security policy. No assets generated and no route code changed.

2026-09-10: Sean approved the style tile. Prepared `designs/chateau/visual-story.md` with draft copy, a 1,400 vh piecewise timeline, illustrative UI and composition constraints. No media generation jobs submitted.

2026-09-10: Gate 2 approved. First Higgsfield image submission rejected because Basic or higher is required; no job created and all 10 credits remain. Five scene prompts saved in `designs/chateau/stills/prompts.md`. Await account access before further submissions.

2026-09-10: Five landscape stills generated and packaged for review. Insights screen occlusion, exterior camera height and interior daylight flagged. No regeneration or clip generation performed.

2026-09-11: Sean requested revisions to all five scenes. Current scene direction and pending lighting decision are recorded in `designs/chateau/stills/revision-direction.md`. Human-operated Insights and the back-facing human Decision Support figure are replaced by an empty control station and front-facing mechanical humanoid respectively.

2026-09-11: Sean approved daylight and one regeneration per scene. Five revised stills and floating-copy previews are ready at `designs/chateau/stills/revision-01/review.html`. No further regeneration or clips submitted.

2026-09-14: Latest direction is `designs/chateau/stills/revision-02-direction.md`. It replaces the empty Insights station with a robot-operated station, removes its rear door from the reading composition and preserves an off-camera side exit for the tour.

2026-09-14: Three authorized revision-02 jobs completed and were inspected. Current board: `designs/chateau/stills/revision-02/review.html`. Insights screen occlusion and copy-area clutter remain; no additional correction or clip submitted. Cost 6 credits, balance 984.

2026-09-14: Sean authorized one Insights correction and requested the robot closer to the console. Revision-03 completed; review board and inspection notes are in `designs/chateau/stills/revision-03/`. Cost 2 credits, verified balance 982. Await still review before clips.

2026-09-14: One approved revision-04 Insights generation completed, using revision-02 as reference. Latest board and inspection notes are in `designs/chateau/stills/revision-04/`. Cost 2 credits; balance 980. No clips generated.

Latest status: Sean accepted Insights revision-04. Decision Support mechanical face correction completed in revision-05 after “continue”; awaits review. Current board: `designs/chateau/stills/revision-05/review.html`. Fresh context: `designs/chateau/HANDOFF.md`. Cost 2 credits; balance 978. No clips submitted.

Sean approved the completed landscape still set after revision-05. Gates 1–3 complete. Next gate: exterior clip only, using revision-02 Exterior; review before Foyer.

Gate 4 exterior first pass completed; review in `designs/chateau/clips/exterior/pass-01/review.html`. Await Sean review. Cost 78, balance 900. No Foyer clip submitted.

Gate 5 Foyer first pass completed using exterior final frame. Review clips/foyer/pass-01/review.html; exit-path caveat documented. Balance 835. Sales awaits review.

2026-09-15: Foyer pass-02 completed (412f82d2-bd76-42ac-8be5-32844d8b4a7d). Review `designs/chateau/clips/foyer/pass-02/review.html` (repo-relative). Left reveal and visible wooden exit improve in samples; two exit-wall doorways and entry-like final corridor remain continuity caveats. Cost 65, balance 770. Await Sean review before Sales; no further regeneration authorized.

2026-09-15 latest: Foyer pass-03 completed. Explicit single-frame upload approved and succeeded (0c0a7d67-175f-41e7-b132-e7087debd2c3). Tail job4cef8f1b-f562-40bc-937c-3e2a452f2e11. Full assembled review in designs/chateau/clips/foyer/pass-03/review.html (repo-relative). Original opening120 frames verified identical by decoded hashes; new tail shows right-side route and single rear door in samples. Await playback review, particularly join/endpoint. Cost32.5; balance737.5. No Sales or further correction authorized.

2026-09-15: Sean approved Insights pass-01 and requested an implementation handoff. All five approved masters verified present and decoded. Current handoff rewritten around assembly and gate 7; obsolete handoff preserved separately. No assembly, route implementation or deployment performed in this handoff task.

2026-09-15: Assembled the five approved masters (timebase-normalised, 1,249 frames), inspected all four joins, extracted 937 delivery frames at 18 fps, and implemented `/chateau`: pinned canvas, ScrollTrigger + Lenis, typed content, tracked Sales phone, loader, reduced-motion stills, contact and nav. Type-check, lint, 42 tests and the production build pass; headless Chromium checks at desktop and mobile widths, reverse and fast scrubbing, and forced reduced motion. Frames committed under `public/assets/chateau/` because Blob was deferred; no deployment. Findings and limitations in `designs/chateau/PRODUCTION-NOTE.md`. Awaiting gate 7 review.

2026-09-16: Gate 7 review, round one. Sean: frames blurry, too much scrolling, remove Skip tour, ink hero text without overlay plus a scroll cue, room scrims to the bottom-left corner, a Next button per section, mobile subjects out of frame. Applied: pinned travel 1,400 → 820 vh, Skip removed, ink hero and ink wordmark over the light scene, animated scroll cue, corner scrims, Next buttons that land on the following copy, per-scene focus crop for portrait. Checks and screenshots repeated. Blur is source resolution (720p masters); upscaling awaits Sean's approval.

2026-09-17: Researched the upscale question. Only ByteDance offers a 2K target; the per-job price is shown only on the Upscale button in the app and is published nowhere, so one long job versus five short ones cannot be costed from the web. Sean to read the button or approve a browser walkthrough. Handoff rewritten for a fresh agent.


2026-09-17: Sean upscaled the five clips in the Higgsfield app (4K, 30 fps, not the 2K first discussed). Copied to `designs/chateau/clips/<scene>/upscale-4k/`, untracked. Next: verify against the masters, re-extract 18 fps frames at 2560×1440, update manifests, decide Blob before committing frames. Handoff rewritten with the progress to date.

2026-09-17: Verified the five 4K upscales against the masters frame by frame (start on frame 0, end on the last frame, 0.8 mapping throughout, no trim or pad). Extracted 932 delivery frames at 18 fps, 2560×1440, quality 78 (216 + 4 × 179; the 30 fps retime is one frame short of 10 s per room), 92 MB against the estimated 140. Manifests, timeline tests and posters updated; tsc, lint, 44 tests and the build pass; headless Chromium at 1440×900 renders the exterior, foyer and Sales holds sharp and survives 300 random jumps (`designs/chateau/assembly/shots/r3-*`). Nothing committed: the frames replace 34 MB of tracked 720p with 92 MB, and whether that goes to git or Vercel Blob is Sean's decision.

2026-09-21: Review round two, applied in the working tree. Sean rewrote the scene copy, removed the eyebrow labels and CTAs, and made each Next label a per-scene `next` string. Mason cut the Sales scene (content, timeline, tests, styles, phone component, served frames and poster; the clip and staging frames stay under `designs/chateau/`), so the tour is four scenes at 670 vh and 753 frames, the foyer's dark doorway cutting to the Overseer's near-black opening. The tour was put inside `SheetShell` and taken back out the same day at Sean's request (full-bleed, wordmark top-left, no links, toggle or CTA on the page); the shell's header is one row site-wide (wordmark, links, EN/ZH, Commission; light/dark and the clock removed, `--nav-h` 0). Sean withdrew the seal-in-navbar and wordmark-as-heading asks after the brand rule was pointed out. tsc, lint, 41 tests and the build pass; headless checks at the three holds and the contact section (`r4-*`), 300 random jumps clean; landing page header checked at 1440 and 390. Still uncommitted pending git versus Blob.

2026-09-21: Blur diagnosis. The Overseer softness is source detail, not delivery: masters are 720p Seedance 2.5 (scene 04: job `2298a07d`, 65 credits), the 4K files are upscales of them, and the canvas draws correctly at DPR 2. Reference sites checked: neverland.agency is the same frame technique (154 WebP at 2560×1920, about 8 MB) but from clean CGI renders; arstraumur.music is a real-time Three.js scene, not applicable to generated footage. Decided: re-extract at 12 fps as AVIF (`web-015`); regeneration of scene 04 at 1080p native is possible on Seedance 2.5 or 2.0 (4k) and awaits Sean's go. Balance 336.38.

2026-09-21: Menu added at Sean's request, modelled on forgeautomotive.co.uk: a Navigate/Close trigger top-right of the chrome (label swap, three lines to a cross), a black full-screen overlay whose content settles from twice its size with a blur, per-letter hover slide with the other links dimmed, and the seal roundel, brass at 9%, that drifts against the cursor through `gsap.quickTo` (Sean chose the seal over a diamond; the ground now fades 250ms after Close, as soon as the words have gone). `chateau-menu.tsx`, styles in `chateau.css`, links in `content.ts` (`menu`), Cormorant 300 added to the layout's font load for the link weight. The overlay portals to `<body>` so the chrome stays above it. Checked at 1682 and 390 wide in Playwright; the Chrome extension tab was rAF-throttled and stalled GSAP, so the parallax was verified there instead. tsc, lint and 41 tests pass; uncommitted with the round-two work.

2026-09-21: Scene 04 regenerated at 1080p. Sean chose a dense Architect-style wall of small screens over fewer larger ones, and a continuous doorway pass from the foyer instead of the hard cut. Still revision-09 (edit of revision-08, 2 credits, job `8a80e241`) approved as the reference; clip pass-05 (Seedance 2.5 video_extension from the foyer tail job `4cef8f1b`, 1080p, 10 s, 120 credits, job `c64f3fc7`) generated and inspected: join continuous, wall dense, figure seated, exit into the oak door. Review in `designs/chateau/clips/decision-support/pass-05/review.html`. Awaiting Sean's scroll review. Balance 214.38. `web-015` held until the clip is approved so the AVIF re-extract runs once.

2026-09-21: `web-015` done. 753 WebP at 18 fps (86 MB) replaced by 504 AVIF at 12 fps (37 MB, libaom crf 26); scene 04 segments authored from the pass-05 footage with the hold at 4.5 s; Chromium checks clean, Safari left to Sean. Sean scrolled it: 12 fps reads fine. He removed the scroll cue and added `chateau-menu.tsx`. Committed on `chateau-tour` and pushed. The git-versus-Blob question closed itself: the served set is 37 MB, in git.
