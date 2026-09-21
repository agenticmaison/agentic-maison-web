---
id: web-015
title: Chateau frames re-extracted at 12 fps as AVIF
status: done
project: website
agent: coder
operator: sean
working_path: .
review_mode: human
plan: chateau-tour
created: 2026-09-21
updated: 2026-09-21
---

# Chateau frames re-extracted at 12 fps as AVIF

## Objective

Cut the served size of the `/chateau` tour without touching its sharpness. Re-extract the four served scenes from the 4K upscales in `designs/chateau/clips/<scene>/upscale-4k/` at 12 fps instead of 18, encoded as AVIF instead of WebP, still 2560×1440 (downscale only, lanczos). Replace the WebP set under `public/assets/chateau/frames/` and update everything that keys off the old count or extension. Read `designs/chateau/HANDOFF.md` and `designs/chateau/PRODUCTION-NOTE.md` first; the extraction command in the production note is the starting point.

Decisions already made:

- 12 fps and AVIF are both agreed. Sales stays cut; extract exterior, foyer, decision-support and insights only.
- AVIF only, no WebP fallback set. A browser without AVIF decode gets the existing reduced-motion layout of posters. Add that check to the loader's capability gate so those browsers do not fetch frames that will not decode.
- Quality target is "matches the current WebP q78 set by eye at 1:1", not a fixed encoder number. Pick the AVIF quality by comparing crops of the same frame (the Overseer hold, frame 54 at 18 fps, is the reference) and record the setting. `avifenc` is not installed; ffmpeg here has `libaom-av1` and `libsvtav1`.
- Segment frame indices in `src/lib/chateau/content.ts` are local to the 18 fps sequence. For exterior, foyer and insights, rescale every `from`, `to` and `count` by 12/18 and round so each scene's last segment still ends on its last frame. The beat frames and holds must land on the same moments of the footage, not the same index numbers. Update the "18 fps" comments and the `pattern` type while there.
- **Scene 04 is new footage** (`clips/decision-support/pass-05/`, upscale at `clips/decision-support/upscale-4k/decision-support-4k.mp4`; the pass-04 upscale is kept beside it as `-pass-04-superseded`). Do not rescale its old segments. Keep its 150 vh structure (10 entry, 25 settle, 30 hold, 30 arc, 45 departure, 10 dark) and author new `from`/`to` from the clip's timed beats: doorway pass 0 to 1.5 s, settle 1.5 to 5 s with the hold on the settled frame, turn and departure 5 to 9 s, dark oak 9 to 10 s. Confirm the beat frames against a contact sheet of the 12 fps extraction, not the prompt alone. The foyer → Overseer join is now a continuous doorway pass, so the first segment's comment ("already visible and brightening") no longer applies; the chamber is visible through the door from frame 0.
- Regenerate the scene 04 poster (`public/assets/chateau/posters/04-decision-support.webp`) from the new hold frame; the other posters stay as they are.
- Posters stay WebP; only the scene 04 poster is regenerated.
- Do not commit. The working tree is deliberately uncommitted pending Sean's git-versus-Blob decision; leave the new frames in place the same way and record sizes in the Result.

## Acceptance Criteria

- [x] Four scenes under `public/assets/chateau/frames/` as `%04d.avif`, 2560×1440, contiguous zero-based numbering, counts matching the decoded 12 fps extraction; the WebP frames removed. Total bytes before and after recorded in the Result.
- [x] `content.ts` counts, patterns and segment ranges updated; `timeline.test.ts` passes with the new counts; `tsc --noEmit`, `pnpm lint` and `pnpm build` clean.
- [x] 1:1 crops of the Overseer hold frame, old WebP beside new AVIF, saved under `designs/chateau/assembly/shots/` and named in the Result, with the chosen encoder setting.
- [x] Headless Chromium at 1440×900: the three holds and the contact section render, 300 random fast jumps without a runtime error, and the loader's decode-ahead keeps up under a fast scrub (report frames-behind or dropped draws, not just "no error").
- [ ] Checked in Safari, not only Chromium: the tour scrubs and the AVIF frames decode. If Safari on this machine cannot be driven headless, say so in the Result and leave it for Sean's scroll pass. — **not done; Safari cannot be driven here.** See the Result.
- [x] A browser with no AVIF support gets the reduced-motion layout and fetches no frames (verify by stubbing the capability check).


## Work Log

**Quality reference substituted.** The PRD names the Overseer hold, frame 54 at 18 fps, as the WebP to match. Scene 04 is new footage, so that frame no longer corresponds to anything extracted. On Mason's instruction the encoder setting was chosen on unchanged footage instead — the foyer hold (12 fps frame 42), cross-checked against the exterior and Insights holds — and the same setting applied to all four scenes. The scene 04 crops compare the new AVIF hold against a fresh WebP q78 encode of the same 4K source frame.

**CRF 26 chosen, by eye and by SSIM.** `avifenc` is not installed, so encoding is ffmpeg `libaom-av1 -still-picture 1 -pix_fmt yuv420p`. A ladder at CRF 24/26/28/30/32/34/36/38/42 was measured against the lossless PNG of the same source frame on three scenes. CRF 28 sits almost exactly on WebP q78's SSIM; CRF 26 is at or above it on all three (foyer 0.9620 vs 0.9604, exterior 0.9757 vs 0.9735, insights 0.9470 vs 0.9445) for roughly 60% of the bytes. CRF 26 was taken as the conservative side of "matches by eye", since the open review item behind the 4K upscale was sharpness. 1:1 crops confirmed it: brass hairlines on the sphere, the marble floor pattern, the monitor-wall bezels and the armour plate seams are all indistinguishable from the WebP.

**The first extraction produced 504 undecodable files.** Extracting the sequence in one command with ffmpeg's image2 muxer (`-f image2 .../%04d.avif`) writes an **8-byte, empty `av1C` configuration box** in every file. `file` reports "ISO Media, AVIF Image" and `ffprobe` reports `av1 2560x1440`, so the usual verifications all pass — but no browser can decode them, and the tour fell straight through to the stills layout on the first Chromium run. A 2×2 probe encoded separately decoded fine, which is what isolated it: encoding each frame in its own `-f avif` command writes a valid 12-byte `av1C`. The pipeline is now PNG intermediates, then one AVIF encode per file, 8-way parallel. All 504 files were checked for an `av1C` of at least 12 bytes, and all 504 were separately decoded end to end through macOS ImageIO. The trap, the commands and the one-line check are recorded in `PRODUCTION-NOTE.md` and in the traps list in `HANDOFF.md`, because every cheap verification passes on the broken output.

**Scene 04 segments authored from a contact sheet,** not from the prompt. The 12 fps extraction was tiled at 6-frame steps, then at 1-frame steps around each boundary. The beats land where the PRD said they would: doorway pass ends at frame 18 (1.5 s) as the jambs clear; the figure leaves frame at 80–81, so the arc past him ends at 78; the oak door fills the frame at 108 (9.0 s). One judgment call inside the PRD's stated window: the hold sits on **frame 54 (4.5 s)**, not on frame 60 at the end of the 1.5–5 s settle. By 60 the camera has drifted and the chandelier is no longer centred over the figure; 54 is where the composition matches the criterion the other holds were chosen by — figure central, monitor wall complete, chandelier in frame. The split of the 5–9 s turn is arc 54→78 over 30 vh and departure 78→108 over 45 vh, which keeps the two beats at close to the same frames-per-vh the 18 fps cut had.

**The other three scenes were rescaled by 12/18 and land on the same moments.** `round(f × 2/3)` puts every beat on the same timecode and every scene's last segment on its last frame with no fudging: exterior 215→143, foyer and Insights 178→119. Holds: exterior 72→48 (4.0 s), foyer 63→42 (3.5 s), Insights 72→48 (4.0 s).

**AVIF capability gate.** `src/lib/chateau/avif-support.ts` probes decode with a 2×2 AVIF data URI and caches the answer; the tour holds in `'tour'` mode without constructing the loader until the probe resolves, and switches to `'static'` if it fails. The loader now derives the file extension from `manifest.pattern` rather than hard-coding one, so the manifest stays the single source of truth. No new dependency.

**Verification.** `tsc --noEmit` clean. `pnpm test` 41 pass, 0 fail. `pnpm lint` 0 errors, the 8 pre-existing `<img>` warnings elsewhere. `pnpm build` clean. Headless Chromium at 1440×900 was run against `pnpm build` + `next start`, not the dev server. Frames-behind was measured by patching `CanvasRenderingContext2D.prototype.drawImage` from the test harness to record each drawn frame's URL and the scroll position at draw time, then comparing against the frame that position demands under the new segment table — no instrumentation was added to the tour itself.

## Result

**Frames.** 753 WebP at 18 fps, **86,465,088 bytes**, replaced by 504 AVIF at 12 fps, **37,667,158 bytes** — a 56.7% cut. All 2560×1440, contiguous zero-based `%04d.avif`, no WebP left under `public/assets/chateau/frames/`.

| Scene | Frames | Bytes |
| --- | --- | --- |
| `01-exterior` | 144 | 9,712,184 |
| `02-foyer` | 120 | 5,813,035 |
| `04-decision-support` | 120 | 14,032,538 |
| `05-insights` | 120 | 8,109,401 |

Encoder setting: **`libaom-av1 -still-picture 1 -crf 26 -cpu-used 4 -pix_fmt yuv420p -f avif`**, one command per frame, from PNG intermediates extracted with `fps=12,scale=2560:-2:flags=lanczos`.

**Comparison crops** (1:1, 900×600, saved as PNG so the comparison is not itself recompressed):

- `designs/chateau/assembly/shots/web015-overseer-hold-crop-webp-q78.png` and `web015-overseer-hold-crop-avif-crf26.png` — scene 04's new hold, frame 54, WebP q78 beside AVIF CRF 26 from the same 4K source frame. Full frame: 300,326 bytes WebP against 204,450 bytes AVIF.
- `designs/chateau/assembly/shots/web015-foyer-hold-crop-webp-q78.png` and `web015-foyer-hold-crop-avif-crf26.png` — the foyer hold, the unchanged footage the setting was actually chosen on.

**Chromium, 1440×900, production build.** Loader unlocks; all four holds and the contact section render — `web015-hold-01-exterior.jpg`, `web015-hold-02-foyer.jpg`, `web015-hold-04-decision-support.jpg`, `web015-hold-05-insights.jpg` and `web015-contact.jpg`, all under `designs/chateau/assembly/shots/`. 300 random jumps fired at 20 ms intervals: no runtime error, no unhandled rejection, 96 draws, **every one of them the exact frame its scroll position demanded**. A continuous 2 s sweep of the whole 670 vh: 158 draws, again **zero frames behind and zero nearest-ready substitutions**, median 14 ms between draws. The decode-ahead keeps up. The only console errors are the pre-existing `/en/icon.svg` and `_vercel/insights/script.js` 404s.

**No-AVIF browser.** Stubbed by overriding the `HTMLImageElement.prototype.src` setter before page scripts run so any AVIF source fails, which is the capability rather than the check. Result: **zero requests under `/assets/chateau/frames/`**, no canvas, the four WebP posters in the stills layout with the copy in flow and the contact form — `designs/chateau/assembly/shots/web015-no-avif-stills.jpg`.

**Safari was not driven.** Remote Automation is off in Safari on this machine and turning it on needs an admin password and a GUI toggle in the Develop menu; Safari has no headless mode, and no WebDriver client is installed. What was checked instead: **all 504 frames decode through macOS ImageIO at 2560×1440**, which is the decoder WebKit uses on this platform, so the format is not in doubt. The scrub itself in Safari is left for Sean's pass.

**Files changed** (nothing committed, per the PRD):

- `src/lib/chateau/content.ts` — counts 144/120/120/120, `pattern: '%04d.avif'`, all four segment tables, the fps comments.
- `src/lib/chateau/avif-support.ts` — new; the decode probe.
- `src/lib/chateau/frame-loader.ts` — extension derived from `manifest.pattern`.
- `src/app/[locale]/chateau/chateau-tour.tsx` — the capability gate.
- `src/lib/chateau/timeline.test.ts` — 504 frames, last frame 503, exterior hold 48, exterior last frame 143.
- `public/assets/chateau/frames/**` — 753 WebP deleted, 504 AVIF added.
- `public/assets/chateau/posters/04-decision-support.webp` — regenerated from the new hold frame, still WebP, 2560×1440. The other posters untouched.
- `designs/chateau/PRODUCTION-NOTE.md`, `designs/chateau/HANDOFF.md` — provenance, extraction commands, hold table, checks, and the `av1C` trap.
- `designs/chateau/assembly/shots/web015-*` — ten evidence files.
- `designs/chateau/frames-staging-12fps-avif/` — the staging set, untracked like `frames-staging-2k/` beside it.

**One thing the hosting decision should know:** the frame set is now 35.9 MB against the 34 MB of 720p WebP already tracked in git. The 84 MB that made git-versus-Blob a real question is gone.

## Handoff / Next Action

For Sean, in order:

1. **Scroll it.** `pnpm dev -p 3111`, then `/en/chateau`. Unreviewed by a person: the 12 fps cadence (the substantive risk in this change — 12 fps is a visible cadence, and only a person scrolling can say whether the tour still reads as motion rather than as a slideshow), the new Overseer footage and its beats, AVIF sharpness on a retina display, and the foyer → Overseer join, which is now a continuous doorway pass rather than a cut through dark.
2. **Safari.** Open the same URL in Safari and scrub. The frames decode through the Safari stack — that was verified — but nobody has scrubbed the tour in it.
3. **Then the hosting call,** which this task has made cheaper: 35.9 MB against the 34 MB already tracked. Blob's argument was repo weight, and most of that weight is gone.

Nothing is blocked and nothing is committed. `designs/chateau/HANDOFF.md` carries the commit path when the hosting call is made.

One item for the amendment pile, since a worker may not edit `AGENTS.md`: `unshared/website/AGENTS.md` says nothing about image delivery, and this task turned up a trap that costs an hour to rediscover — ffmpeg's image2 muxer writes an empty `av1C` for an AVIF sequence, and `file`, `ffprobe` and a dimension check all pass on the broken output. It is recorded in `designs/chateau/PRODUCTION-NOTE.md` and in the traps list in `designs/chateau/HANDOFF.md`, which is the right depth for it; it is only worth promoting if AVIF spreads beyond this route.
