# Chateau tour — production note

Gate 7 deliverable: the integrated landscape tour at `/chateau`, built from four of the five approved masters. The Sales scene was cut at Sean's second review; its clip and frames stay under `designs/chateau/` and are not served. Portrait (gate 8) and promotion to `/` (gate 9) are not started.

## Direction

Warm late-afternoon daylight, limestone, dark oak and restrained brass. Door darkness comes from the footage's own approach to a closed door, never from an applied fade. Rooms are additive: a scene is one entry in `src/lib/chateau/content.ts` and one frame folder.

## Asset provenance

| Scene | Master (24 fps, 1280×720, silent) | Source | Upscale (4K, 30 fps) | Delivery frames (12 fps, 2560×1440, AVIF) |
| --- | --- | --- | --- | --- |
| 01 Exterior | `clips/exterior/pass-01/exterior.mp4` | Higgsfield job `8d30317a-8524-466c-bdee-990ec81073e2` | `clips/exterior/upscale-4k/exterior-4k.mp4` | 144, 9.3 MB |
| 02 Foyer | `clips/foyer/pass-03/foyer.mp4` | first 120 frames of pass-02 + tail job `4cef8f1b-f562-40bc-937c-3e2a452f2e11` | `clips/foyer/upscale-4k/foyer-4k.mp4` | 120, 5.5 MB |
| 03 Sales (cut) | `clips/sales/pass-03/sales.mp4` | approved opening + extension job `81a2f4cb-35fb-421c-9928-60ccfbcee701` | `clips/sales/upscale-4k/sales-4k.mp4` | not extracted at 12 fps; not served |
| 04 Decision Support | `clips/decision-support/pass-05/decision-support.mp4` (1920×1080, 24 fps) | job `c64f3fc7-7a32-481d-b293-518d85de6aa2`, forward extension from the foyer tail job `4cef8f1b`, image reference `stills/revision-09` | `clips/decision-support/upscale-4k/decision-support-4k.mp4` (pass-04's upscale kept as `-pass-04-superseded`) | 120, 13.4 MB |
| 05 Insights | `clips/insights/pass-01/insights.mp4` | job `b2e00e03-f2cd-4933-a958-702593502a10` | `clips/insights/upscale-4k/insights-4k.mp4` | 120, 7.7 MB |

Served: 504 frames, 35.9 MB (exterior 144; foyer, Decision Support and Insights 120 each). Masters are unchanged and remain the approved reference; the 4K files are Sean's upscales of them through the Higgsfield app (provider and credits not recorded). Reference stills are listed in `HANDOFF.md`.

The upscaler retimed the footage to 30 fps: 289 master frames became 360, 240 became 299, so each room is one 30 fps frame short of 10 s and yields 179 delivery frames instead of 180. Every 4K frame was matched against the master by mean absolute difference at 320×180: each clip starts on master frame 0, ends on the master's last frame, and follows the 0.8 mapping throughout, so no trim or pad at either end and the beat frames and hold frames are unchanged. First, middle and last frames were also compared by eye.

Extraction is two passes, per scene, from the 4K upscales (downscale only). PNG first, then one AVIF encode per file:

```
ffmpeg -i clips/<scene>/upscale-4k/<scene>-4k.mp4 -vf "fps=12,scale=2560:-2:flags=lanczos" -start_number 0 png/0N-scene/%04d.png
ffmpeg -i png/0N-scene/%04d.png -c:v libaom-av1 -still-picture 1 -crf 26 -cpu-used 4 -pix_fmt yuv420p -f avif frames-staging-12fps-avif/0N-scene/%04d.avif
```

**Do not collapse that into one `-f image2 .../%04d.avif` command.** ffmpeg's image2 muxer writes an 8-byte, empty `av1C` configuration box for every file in the sequence, so the frames carry no AV1 decoder configuration. `file` still reports "ISO Media, AVIF Image" and `ffprobe` still reports `av1 2560x1440`, but Chromium refuses every one of them and the tour falls through to the stills layout. Encoding each frame in its own `-f avif` command writes a valid 12-byte `av1C`. The check is one line:

```
python3 -c "d=open(F,'rb').read(); i=d.find(b'av1C'); print(int.from_bytes(d[i-4:i],'big'))"   # must be >= 12
```

`avifenc` is not installed on this machine; ffmpeg's `libaom-av1` and `libsvtav1` are.

CRF 26 was chosen by comparing 1:1 crops of the foyer, exterior and Overseer hold frames against a WebP q78 encode of the same source frame. It is indistinguishable by eye and scores at or above WebP q78 on SSIM in all three (foyer 0.9620 vs 0.9604, exterior 0.9757 vs 0.9735, insights 0.9470 vs 0.9445) at roughly 60% of the bytes. Crops are in `assembly/shots/web015-*-crop-*.png`.

2560×1440 is what the behavioural reference serves on windows over 1280 px; 4K frames would be more than any viewport needs at roughly nine times the bytes. Verified: decoded counts, contiguous zero-based numbering, a valid `av1C` in all 504 files, 2560×1440 on first and last frames, and a full decode of all 504 through macOS ImageIO. Posters stay WebP: copies of frame 0000 (exterior) and the hold frame of each scene. The continuity preview and join inspection are in `assembly/README.md`.

**AVIF is the only delivery format — there is no WebP fallback set.** `src/lib/chateau/avif-support.ts` probes AVIF decode with a 2×2 data URI before the loader is constructed; a browser that fails the probe gets the reduced-motion stills layout (the posters are WebP) and fetches no frames at all.

## Where the frames are served from

The 720p preview frames (34 MB) are committed under `public/assets/chateau/frames/<scene>/NNNN.webp`, with posters under `public/assets/chateau/posters/`. The 2560×1440 AVIF set (35.9 MB, 504 files named `NNNN.avif`) has replaced them in the working tree but is not committed: whether it goes into git or into Vercel Blob is Sean's call. The 12 fps AVIF re-extract brought the set from 84 MB down to 35.9 MB, which is close enough to the 34 MB already tracked that git is no longer the expensive option it was. When Blob is set up, change `FRAME_BASE` in `content.ts` to the Blob base URL and remove the folder from `public/`. The `assets/` prefix is already excluded from the locale proxy, so nothing else changes.

## Route

- `src/app/[locale]/chateau/page.tsx` — server page, metadata through `pageMetadata()`, `noindex` until promotion. No `SheetShell`: the route is full-bleed, with the wordmark fixed top-left as its only chrome. Sean tried the sheet frame on this page on 2026-09-21 and took it off the same day.
- `src/app/[locale]/chateau/chateau-tour.tsx` — the client tour: one pinned 2D canvas, GSAP ScrollTrigger (pin + scrub), Lenis (smoothing only), copy overlays, the loader, the stills fallback and the contact section. The stage is `100svh` and pins at the top of the viewport.
- `src/app/[locale]/chateau/chateau.css` — the route's styles. The route re-pins the dark theme tokens inside its root so the tour is dark whatever theme the visitor picked elsewhere.
- `src/lib/chateau/content.ts` — copy, per-scene Next labels, UI strings, manifests, pacing.
- `src/lib/chateau/timeline.ts` — pure scroll-to-frame mapping, overlay ramps, quad interpolation, homography. Tested in `timeline.test.ts`.
- `src/lib/chateau/frame-loader.ts` — prioritised, bounded frame loading with retries.

`/chateau` redirects to `/en/chateau` through the existing locale proxy. `/zh/chateau` serves the same English page and canonicalises to `/en/chateau`.

## Measured pacing

Pinned travel is 670 vh: exterior 200, foyer 170, each of the two rooms 150, each containing one 30 vh still-frame hold. The first build used 1,400 vh; Sean's first review cut it to 820, and removing the Sales scene took the remaining 150. Beat frames were chosen from the footage, not from the storyboard's targets:

| Scene | Hold frame (local, 12 fps) | Time | Why |
| --- | --- | --- | --- |
| Exterior | 48 | 4.0 s | House established mid-descent; sky still open for the hero. |
| Foyer | 42 | 3.5 s | Full sphere reveal, wiring visible, before the arc begins. |
| Decision Support | 54 | 4.5 s | Figure central, monitor wall complete, chandelier centred above him. |
| Insights | 48 | 4.0 s | Robot close to the console, holograms populated on all sides. |

Exterior, foyer and Insights keep the moments they held at 18 fps; their indices were rescaled by 12/18 so each scene still ends on its last frame. Decision Support is new footage (pass-05) and its segments were authored from a contact sheet of the 12 fps extraction: doorway pass 0–18, settle 18–54, hold 54, arc past the figure 54–78, turn and departure 78–108, dark oak 108–119. The foyer → Overseer join is now a continuous doorway pass — the chamber is visible through the door from frame 0, so there is no brightening to wait for.

Copy enters and leaves on local vh ramps set per scene in `content.ts`. All overlay state is a pure function of scroll position, so reverse scrolling reconstructs it exactly. A copy block with a `next` label carries a button that scrolls to the point where the following scene's copy has fully entered. There are no eyebrow labels and no CTAs in the blocks. Insights has no button, and the contact section follows the footage.

Each scene declares a focus point, the fraction of the frame its subject occupies. When the viewport is a different shape from the 16:9 frame the cover crop keeps that point in view, which is what keeps the chateau, the sphere and the seated figure on a portrait phone.

## Loading

Before anything is fetched the tour probes AVIF decode (`src/lib/chateau/avif-support.ts`); a browser that fails it gets the stills layout and requests no frames. Scene one's 144 frames then gate the scroll behind the branded loader (poster shows immediately). After unlock, the loader reorders its queue on every frame change: the current frame and 36 neighbours first, then everything ahead, then everything behind. Six fetches in flight, three attempts per frame with backoff, at most four decodes ahead. If more than 10% of scene one fails, the page switches to the stills layout with the failure line. A missing frame mid-tour draws the nearest ready frame in the same scene.

## Checks performed

- `tsc --noEmit`, `pnpm lint` (0 errors; 8 pre-existing `<img>` warnings elsewhere), `pnpm test` (44 pass), `pnpm build` (clean). Repeated after the 2560×1440 frames replaced the 720p set, and again after the 12 fps AVIF set replaced that (41 tests).
- **12 fps AVIF set, headless Chromium at 1440×900 against `pnpm build` + `next start`:** loader unlocks; all four holds and the contact section render (`assembly/shots/web015-*.jpg`); 300 random jumps at 20 ms with no runtime error; a 2 s sweep of the whole 670 vh produced 158 draws, every one of them the exact frame its scroll position demanded — zero frames behind, zero nearest-ready substitutions, median 14 ms between draws. With AVIF decode stubbed out, the page renders the four WebP posters in the stills layout and issues zero requests under `/assets/chateau/frames/`.
- With the 2560×1440 frames, headless Chromium at 1440×900: loader reaches 100% and unlocks; exterior, foyer and Sales holds rendered (`assembly/shots/r3-*.jpg`); 300 random fast jumps across the tour without a runtime error. The only console error is the pre-existing `/en/icon.svg` 404 in dev.
- After the Sales cut: 41 tests pass; headless Chromium at 1440×900 renders the exterior, foyer and Overseer holds and the contact section full-bleed with the wordmark top-left (`assembly/shots/r4-*.jpg`); 300 random jumps without a runtime error. The landing page's schematic pane still sits at `--header-band-h` (83 px) with the one-row header, at 1440 and 390 wide.
- Headless Chromium at 1440×900: loader reaches 100% and unlocks; screenshots at each hold; join positions; reverse jumps; 300 random fast jumps across the whole tour without a crash; hidden overlays are `inert` and out of the tab order. After the pacing revision: Next from the hero lands on the foyer copy, Next from the foyer on the Sales hold (`assembly/shots/r2-*.jpg`).
- 390×844: hero and Sales hold rendered.
- Reduced motion (forced through a `matchMedia` override, before the Sales cut): five stills in flow with copy, contact and nav; no runtime error. Not repeated since; the stills path only lost a scene.

## Checks not performed

Real-time wheel and touch scrolling by a person, Safari and Firefox, a real phone, network throttling, and the Vercel preview itself (no deployment was made at Sean's request). Browser rendering here was headless Chromium only.

## Known limitations

- **Foyer → Overseer is a cut through dark.** The foyer ends at its dark rear doorway (luma 73 on the last frame, the doorway itself black) and the Overseer opens near-black (luma 12) and brightens over nine frames. It reads as a doorway pass. No fade was added, per direction.
- **Mobile is the landscape crop,** steered by each scene's focus point so the subject stays in frame. The separately generated portrait sequence (gate 8) replaces this; no landscape crop is the final portrait deliverable.
- **An explicit `ImageBitmap` cache crashed headless Chromium under fast scrubbing** and was replaced with browser-managed decoding (`img.decode()`, bounded). Decoded memory is now the browser's decision.
- **The exterior hero is ink on the sky, with no scrim.** The room blocks sit on a scrim anchored to the bottom-left corner of the stage. The wordmark, fixed top-left, is ink while the exterior is on screen and cream after.
- **Retina sharpness is not confirmed by a person.** The 2560×1440 frames are drawn at 0.56× on a 1440 px window and at 1.125× on its retina equivalent; the softness Sean saw in round one came from 720p frames drawn at 1.25× and 2.5×. Headless Chromium here runs at DPR 1, so the DPR 2 case is arithmetic until Sean scrolls it.
- **Mobile is still the landscape crop.** The portrait pass at gate 8 replaces it; the focus crop is a stopgap. Not re-screenshotted since the Sales cut.
