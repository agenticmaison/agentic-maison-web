# Chateau tour — production note

Gate 7 deliverable: the integrated landscape tour at `/chateau`, built from the five approved masters. Portrait (gate 8) and promotion to `/` (gate 9) are not started.

## Direction

Warm late-afternoon daylight, limestone, dark oak and restrained brass. Door darkness comes from the footage's own approach to a closed door, never from an applied fade. Rooms are additive: a scene is one entry in `src/lib/chateau/content.ts` and one frame folder.

## Asset provenance

| Scene | Master (24 fps, 1280×720, silent) | Source | Delivery frames (18 fps) |
| --- | --- | --- | --- |
| 01 Exterior | `clips/exterior/pass-01/exterior.mp4` | Higgsfield job `8d30317a-8524-466c-bdee-990ec81073e2` | 217, 8.7 MB |
| 02 Foyer | `clips/foyer/pass-03/foyer.mp4` | first 120 frames of pass-02 + tail job `4cef8f1b-f562-40bc-937c-3e2a452f2e11` | 180, 6.0 MB |
| 03 Sales | `clips/sales/pass-03/sales.mp4` | approved opening + extension job `81a2f4cb-35fb-421c-9928-60ccfbcee701` | 180, 3.4 MB |
| 04 Decision Support | `clips/decision-support/pass-04/decision-support.mp4` | job `2298a07d-d1f3-492d-97c7-23b91b5e84e4` | 180, 9.1 MB |
| 05 Insights | `clips/insights/pass-01/insights.mp4` | job `b2e00e03-f2cd-4933-a958-702593502a10` | 180, 7.2 MB |

Total: 937 frames, 34.4 MB. Masters are unchanged. Reference stills are listed in `HANDOFF.md`.

Extraction, per scene, from the timebase-normalised intermediates in `assembly/norm/`:

```
ffmpeg -i assembly/norm/0N-scene.mp4 -vf fps=18 -start_number 0 -c:v libwebp -quality 78 -compression_level 6 frames-staging/0N-scene/%04d.webp
```

No upscale. Verified: decoded counts, contiguous zero-based numbering, 1280×720, first/middle/last samples. The continuity preview and join inspection are in `assembly/README.md`.

## Where the frames are served from

For this preview the frames are committed under `public/assets/chateau/frames/<scene>/NNNN.webp`, with posters under `public/assets/chateau/posters/`. Sean chose to defer Vercel Blob. When Blob is set up, change `FRAME_BASE` in `content.ts` to the Blob base URL and remove the folder from `public/`. The `assets/` prefix is already excluded from the locale proxy, so nothing else changes.

## Route

- `src/app/[locale]/chateau/page.tsx` — server page, metadata through `pageMetadata()`, `noindex` until promotion.
- `src/app/[locale]/chateau/chateau-tour.tsx` — the client tour: one pinned 2D canvas, GSAP ScrollTrigger (pin + scrub), Lenis (smoothing only), copy overlays, the tracked Sales projection plane, the loader, the stills fallback, the contact section and the post-tour nav.
- `src/app/[locale]/chateau/sales-phone.tsx` — the Telegram illustration.
- `src/app/[locale]/chateau/chateau.css` — the route's styles. The route re-pins the dark theme tokens inside its root so the tour is dark whatever theme the visitor picked elsewhere.
- `src/lib/chateau/content.ts` — copy, UI strings, manifests, pacing, tracked-plane keys.
- `src/lib/chateau/timeline.ts` — pure scroll-to-frame mapping, overlay ramps, quad interpolation, homography. Tested in `timeline.test.ts`.
- `src/lib/chateau/frame-loader.ts` — prioritised, bounded frame loading with retries.

`/chateau` redirects to `/en/chateau` through the existing locale proxy. `/zh/chateau` serves the same English page and canonicalises to `/en/chateau`.

## Measured pacing

Pinned travel is 1,400 vh: exterior 350, foyer 300, each room 250, each containing one 50 vh still-frame hold. Beat frames were chosen from the footage, not from the storyboard's targets:

| Scene | Hold frame (local, 18 fps) | Why |
| --- | --- | --- |
| Exterior | 72 | House established mid-descent; sky still open for the hero. |
| Foyer | 63 | Full sphere reveal, wiring visible, before the arc begins. |
| Sales | 81 | Projection most frontal and stable; the plane keys span frames 36–135. |
| Decision Support | 54 | Figure central, monitor wall complete, chandelier in frame. |
| Insights | 72 | Robot close to the console, holograms populated on all sides. |

Copy enters and leaves on local vh ramps set per scene in `content.ts`. All overlay state is a pure function of scroll position, so reverse scrolling reconstructs it exactly.

## Loading

Scene one's 217 frames gate the scroll behind the branded loader (poster shows immediately). After unlock, the loader reorders its queue on every frame change: the current frame and 36 neighbours first, then everything ahead, then everything behind. Six fetches in flight, three attempts per frame with backoff, at most four decodes ahead. If more than 10% of scene one fails, the page switches to the stills layout with the failure line. A missing frame mid-tour draws the nearest ready frame in the same scene.

## Checks performed

- `tsc --noEmit`, `pnpm lint` (0 errors; 8 pre-existing `<img>` warnings elsewhere), `pnpm test` (42 pass), `pnpm build` (clean).
- Headless Chromium at 1440×900: loader reaches 100% and unlocks; screenshots at each hold; join positions; reverse jumps; 300 random fast jumps across the whole tour without a crash; hidden overlays are `inert` and out of the tab order.
- 390×844: hero and Sales hold rendered.
- Reduced motion (forced through a `matchMedia` override): five stills in flow with copy, three CTAs, contact and nav; no runtime error.

## Checks not performed

Real-time wheel and touch scrolling by a person, Safari and Firefox, a real phone, network throttling, and the Vercel preview itself (no deployment was made at Sean's request). Browser rendering here was headless Chromium only.

## Known limitations

- **Sales → Decision Support is a hard cut.** Sales ends near-black, Decision Support opens with the room visible. No fade was added, per direction. Approved footage.
- **The phone is bounded by the projection.** At 1440 px wide the phone is about 400 px tall and its text about 11 px. Readable, but small; the hold gives time. If it must be larger, the phone can exceed the projection's height by raising `--phone-h` in `chateau.css`, at the cost of overlapping stone.
- **Mobile is the landscape crop.** At portrait widths the cover-fit crops the frame, so the Sales projection and phone sit partly off the right edge and the Foyer sphere is tight. The separately generated portrait sequence (gate 8) replaces this; no landscape crop is the final portrait deliverable.
- **Sales plane keys are hand-read from gridded frames** at 36, 45, 81, 117 and 135 and interpolated linearly. Tracking is good through the hold and the slowed approach; it drifts slightly during the departure, where the phone is already fading.
- **An explicit `ImageBitmap` cache crashed headless Chromium under fast scrubbing** and was replaced with browser-managed decoding (`img.decode()`, bounded). Decoded memory is now the browser's decision.
- **The exterior hero sits over sky.** Cream text needed a heavier local scrim than the rooms. It is still lighter than the visual story's "quiet foreground"; tune at gate 7.
