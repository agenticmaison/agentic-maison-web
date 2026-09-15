# Landscape assembly — continuity preview and delivery frames

Built from the five approved masters listed in `../HANDOFF.md`. Masters are unchanged.

## Files

- `norm/0N-<scene>.mp4` — each master re-encoded to a clean constant 24 fps timeline (libx264, CRF 12) so the joins carry no timebase drift. The original masters mix 1/90000, 1/1000000 and 1/12288 timebases, and a direct concat of them produced 5,878 frames instead of 1,249.
- `landscape-continuity-preview.mp4` — the five normalized clips in scene order, stream-copied. 1,249 frames, 52.041667 s, 1280×720, 24 fps, silent. Review only; the delivered tour uses a canvas.
- `joins/join-<a>--<b>.png` — last three frames of scene A over first three frames of scene B, for each of the four joins.
- `../frames-staging/0N-<scene>/NNNN.webp` — 18 fps delivery frames, 1280×720, quality 78, zero-based contiguous numbering. Staging only, outside git until hosted.

## Frame counts

| Scene | Master frames (24 fps) | Delivery frames (18 fps) | Size |
|---|---|---|---|
| 01 Exterior | 289 | 217 (0000–0216) | 8.7 MB |
| 02 Foyer | 240 | 180 (0000–0179) | 6.0 MB |
| 03 Sales | 240 | 180 (0000–0179) | 3.4 MB |
| 04 Decision Support | 240 | 180 (0000–0179) | 9.1 MB |
| 05 Insights | 240 | 180 (0000–0179) | 7.2 MB |
| Total | 1,249 | 937 | 34.4 MB |

## Join inspection

Mean luma (YAVG, 0–255) of the last three and first three frames at each join, with the visual read of the contact sheets.

| Join | A tail | B head | Read |
|---|---|---|---|
| Exterior → Foyer | 20 / 19 / 19 | 20 / 19 / 19 | Continuous. Dark corridor with a lit doorway ahead on both sides of the cut. |
| Foyer → Sales | 80 / 78 / 77 | 78 / 77 / 76 | Continuous. Same limestone doorway framing on both sides; the Sales opening was extended from the Foyer's approved end. |
| Sales → Decision Support | 17 / 16 / 16 | 26 / 37 / 42 | Hard cut. Sales ends near-black; Decision Support opens with the room already visible and brightening. Known and approved limitation. |
| Decision Support → Insights | 23 / 21 / 20 | 19 / 18 / 18 | Continuous. Very dark oak with faint reflection on both sides. |

No boundary trims are proposed. No fades were added. The Sales → Decision Support cut is the one join the scroll mapping should cover: a short reading hold on the last Sales frame, then the Decision Support entry, reads as a doorway pass rather than a splice.
