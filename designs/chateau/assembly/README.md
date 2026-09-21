# Landscape assembly — continuity preview and delivery frames

Built from the five approved masters listed in `../HANDOFF.md`. Masters are unchanged.

## Files

- `norm/0N-<scene>.mp4` — each master re-encoded to a clean constant 24 fps timeline (libx264, CRF 12) so the joins carry no timebase drift. The original masters mix 1/90000, 1/1000000 and 1/12288 timebases, and a direct concat of them produced 5,878 frames instead of 1,249.
- `landscape-continuity-preview.mp4` — the four served scenes in order (Sales cut), stream-copied from `norm/` via `norm/concat-4.txt`. 1,009 frames, 42.041667 s, 1280×720, 24 fps, silent. Scene 04 is the pass-05 regeneration. Review only; the delivered tour uses a canvas.
- `joins/join-<a>--<b>.png` — last three frames of scene A over first three frames of scene B, for each of the four joins.
- `../frames-staging/0N-<scene>/NNNN.webp` — the first 18 fps delivery set, 1280×720, quality 78, extracted from `norm/`. Superseded.
- `../frames-staging-2k/0N-<scene>/NNNN.webp` — the current delivery set, 18 fps, 2560×1440, quality 78, zero-based contiguous numbering, extracted from the 4K upscales in `../clips/<scene>/upscale-4k/`. Staging only, outside git until hosted. Provenance and the verification against the masters are in `../PRODUCTION-NOTE.md`.

## Frame counts

| Scene | Master frames (24 fps) | 4K upscale frames (30 fps) | Delivery frames (18 fps, 2560×1440) | Size |
|---|---|---|---|---|
| 01 Exterior | 289 | 360 | 216 (0000–0215) | 25 MB |
| 02 Foyer | 240 | 299 | 179 (0000–0178) | 16 MB |
| 03 Sales (cut from the tour) | 240 | 299 | 179 (0000–0178), staging only | 8.4 MB |
| 04 Decision Support | 240 (pass-05, 1920×1080 master) | 299 | pending `web-015` (12 fps AVIF) | — |
| 05 Insights | 240 | 299 | 179 (0000–0178) | 19 MB |
| Total | 1,249 | 1,556 | 932 (753 served) | 92 MB (84 served) |

The Sales scene was cut at Sean's second review; its frames stay in staging and are not under `public/`. The superseded 720p set was 217 + 4 × 180 = 937 frames, 34.4 MB. The rooms lost one frame each because the upscaler's 30 fps retime is one frame short of 10 s.

## Join inspection

Mean luma (YAVG, 0–255) of the last three and first three frames at each join, with the visual read of the contact sheets.

| Join | A tail | B head | Read |
|---|---|---|---|
| Exterior → Foyer | 20 / 19 / 19 | 20 / 19 / 19 | Continuous. Dark corridor with a lit doorway ahead on both sides of the cut. |
| Foyer → Sales | 80 / 78 / 77 | 78 / 77 / 76 | Continuous. Same limestone doorway framing on both sides; the Sales opening was extended from the Foyer's approved end. Sales is cut; kept for the record. |
| Foyer → Decision Support (pass-05) | 80 / 78 / 77 | 75 / 74 / 72 | Continuous. The foyer's open oak doorway with black beyond becomes the same doorway with the chamber dimly visible beyond it; a doorway pass, not a cut. |
| Sales → Decision Support (pass-04) | 17 / 16 / 16 | 26 / 37 / 42 | Superseded: Sales is cut and pass-04 is replaced by pass-05. |
| Decision Support → Insights | 23 / 21 / 20 | 19 / 18 / 18 | Continuous. Very dark oak with faint reflection on both sides. |

No boundary trims are proposed. No fades were added. With pass-05 every live join is continuous.
