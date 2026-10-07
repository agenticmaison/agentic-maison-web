# Chateau tour — editing guide

All copy, each scene's Next label, the loader lines and the contact section live in `src/lib/chateau/content.ts`. A scene without a `next` has no button. Change a string there and it changes everywhere it appears, including the static fallback. Pacing lives in the same file: each scene has a list of `segments`, one per beat, giving the scroll distance in vh and the local frame range it covers. A segment whose `from` equals its `to` is a reading hold. To make a room linger, lengthen its hold; to slow a move, give its segment more vh; to shift a hold to a different moment, change the frame number. Copy timing is the `beat` on each scene, in local vh: `enter` is the fade-in range, `exit` the fade-out range. The tests in `src/lib/chateau/timeline.test.ts` check that the segments still sum to 880 vh and that every scene reaches its last frame, so run `pnpm test` after a pacing edit.

The Company Brain holds frame 42 for 100 vh, from local 55 to 155 vh. Its main copy stays fully visible throughout. `brainCallouts` defines eight labels with staggered entrances and a shared fade-out from local 137 to 155 vh. The first four appear top-to-bottom on the left, then the last four appear top-to-bottom on the right. White connectors are horizontal without arrowheads. An SVG ellipse masks connectors over the sphere, using the same cover crop as the footage. Remeasure that ellipse if the hold frame changes. The static fallback shows the labels as a list.

Desktop connectors share the length of the shortest line measured from the base CSS positions to the sphere mask. Each label shifts horizontally to match that length, following the sphere's outline. The length recalculates on resize. Increase `left: 22%` or `right: 5%` in the corresponding `.ch-brain-callout` rule in `chateau.css` to bring the base positions closer and reduce the shared length once that column supplies the shortest line. All Company Brain, Overseer and Oracle callouts are hidden on screens up to 1100 px wide, including their static fallback lists. Change that breakpoint in the `.ch-brain-callout, .ch-brain-static-labels` media query in `chateau.css`.

The Overseer and the Oracle each hold for 100 vh, from local 35 to 135 vh. Their frames remain 54 and 48 respectively. `roomCallouts` in `src/lib/chateau/content.ts` holds their eight floating labels and editable positions. Labels enter in array order, from local 38 to 78 vh. All eight remain fully visible until 117 vh, then fade together to zero at 132 vh. The camera waits until 135 vh to resume. Both rooms' main copy stays fully visible throughout the hold and fades out from 140 to 155 vh. The Oracle's Next button goes to the contact section.

## Positioning the room labels

Find the label by its `text` in `roomCallouts`. `decision-support` is the Overseer; `insights` is the Oracle. Each label has three `[x, y]` pairs:

```ts
{
  text: 'Understand what your staff are doing',
  desktop: [8, 18],
  tablet: [5, 11],
  mobile: [3, 11],
}
```

The pair sets the label's **top-left corner** as percentages of the visible scene, not of the original footage. `[8, 18]` means 8% from the left and 18% from the top. Increase `x` to move right; increase `y` to move down. Decimal values work, so `[8.5, 17.25]` is valid. Positions stay fixed while that label is visible. There is no random placement on reload and no automatic packing that changes your coordinates.

| Profile | When it applies | Maximum label width |
| --- | --- | --- |
| `desktop` | Landscape, wider than 1100 px | 18% of scene width |
| `tablet` | Portrait screens wider than 1100 px | 28% |
| `mobile` | Inactive: callouts are hidden up to 1100 px | — |

The rules live in the `.ch-room-callout[data-side] p` block and its media queries in `src/app/[locale]/chateau/chateau.css`. Change their breakpoints or `max-width` values there. The Company Brain uses separate positioning rules and keeps its connectors.

To check an edit, scroll to the room's still hold until all eight labels appear. In browser developer tools, switch between landscape and portrait screens wider than 1100 px. Edit the corresponding coordinate pair and check again. At 1100 px and below, no callouts should appear. Try both tall and short screens within each profile: the footage crops differently, and wrapped labels occupy more height. Keep the entire box clear of the robot, other labels, the navigation and the lower-left scene copy. A top-left corner outside the robot does not guarantee that the rest of the label clears it. On screens wider than 1100 px, the static fallback shows the labels as a list below the still instead of positioning them over it.

Run `pnpm test` after editing coordinates or timing. The coordinate check catches missing or out-of-range positions; visual checks catch overlaps.

Adding a room is one new entry in `scenes` and one frame folder under `public/assets/chateau/frames/`, with a poster under `posters/`; the timeline, loader and stills layout pick it up. Nothing is tracked onto the footage any more; the Sales projection and its phone were removed with that scene, and the tracked-plane code went with them (last in commit `2551cab`'s tree if it is ever needed). Never put copy, headings or UI into the frames themselves; the page owns every word.
