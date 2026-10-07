---
id: web-014
title: Chateau landscape key stills
status: done
project: website
agent: mason
operator: sean
working_path: .
review_mode: human
plan: chateau-tour
depends_on: [web-013]
created: 2026-09-10
updated: 2026-09-14
---

# Chateau landscape key stills

## Objective

Generate and inspect one landscape composition still per scene against the approved `designs/chateau/visual-story.md`, keeping materials and lighting consistent. Present all five for Sean's review before clips.

## Acceptance Criteria

- [x] Five landscape stills retrieved with original files, prompts and job IDs.
- [x] Inspect architecture, light, subject, text space and blank hero screens.
- [x] Add three reference stills to the style tile.
- [x] Record any failed requirements without unauthorized regeneration.
- [x] Sean approves stills before exterior clip production.

## Implementation Notes

Higgsfield GPT Image 2, 16:9, 2k, medium, one image per scene. Live estimate is 2 credits per image, 10 for five first passes. Credits only; no trial activation or purchase. Check the live schema before every job. Save results before considering any resubmission. Later scenes may use earlier first-pass images as material references; these are not yet approved clip references.

## Work Log

2026-09-10: Sean approved gate 2. Confirmed 10-credit balance and live estimates. Started the landscape still pass.

2026-09-10: Live schema and estimate permitted a 2-credit preflight, but the first actual submission returned “Requires basic plan or higher.” submitted_count was 0 and no job ID was issued. A follow-up balance check confirmed all 10 credits remain. No further submissions attempted.

## Result

Five original PNGs, a review board and inspection notes are in `designs/chateau/stills/`. All originals are 2688 × 1520. `designs/chateau/stills/review.html` presents them in story order. `designs/chateau/stills/generation-record.json` records the exact prompts, references, job IDs, dimensions, sizes and checksums. Three first-pass references are added to `designs/chateau/style-tile.html`.

Insights has a hand overlapping its hero screen. Exterior camera height and interior window daylight depart from the approved plan. These are recorded for review; no regeneration performed. All five master images and local links were verified. Browser verification of the HTML remains unperformed.

## Handoff / Next Action

Review `designs/chateau/stills/revision-04/review.html`. Latest Insights direction supersedes the blank central hero screen: populated ambient holograms span both sides, with a closer robot/console view. Sales retains its blank projection. Await still approval before clips; further regeneration requires authorization.

## Additional work log

2026-09-10: Sean enabled access. Balance check returned Plus with 1,010 credits. Exterior submission succeeded; job ID recorded in designs/chateau/stills/jobs.json.

2026-09-10: All five jobs completed, originals retrieved and visually inspected. Added the review board and three style-tile references. Checked files, checksums and links. Awaiting gate 3 decisions.

2026-09-11: Sean supplied feedback for all five scenes. Saved concrete revised prompts, including a supported wired brain, front-facing mechanical humanoid and unoccupied compact holographic control room. Recommended warm late-afternoon daylight; awaiting lighting confirmation and regeneration approval. No job submitted.

2026-09-11: Sean confirmed daylight, emphasised floating-text space, and explicitly authorized one regeneration per scene. Producing revision-01 while preserving first-pass originals.

2026-09-11: Five authorized revisions completed and inspected. Exterior is elevated and offset in daylight; sphere is supported and wired; Sales is closer; Decision Support has a front-facing humanoid; Insights is unoccupied. Remaining caveats are documented. Created copy/scrim preview, updated style tile and preserved the first review. Local assets, checksums, anchors and control labels passed static checks; browser verification remains unperformed.

2026-09-14: Sean requested 75% sky and a more distant elevated exterior; human-fleshed Decision Support face and colour business-operations screens; a robot-operated, room-width Insights console with layered holograms and no rear door. Saved the supplied gesture reference, removed the hero eyebrow and changed mobile review copy to overlay. Static checks passed. Browser visual verification remains unperformed.

2026-09-14: Sean authorized the three requested regenerations. Uploaded and confirmed the supplied Insights reference. Three jobs submitted at 2 credits each; IDs saved before polling.

2026-09-14: Revision-02 originals and floating-copy board packaged; static checks passed. Image limitations documented in revision-02/inspection.md. Balance 984 after 6 credits. Browser visual QA remains unperformed.

2026-09-14: Sean authorized one Insights correction and requested the robot closer to the console. Revision-03 completed; review board and inspection notes are in `designs/chateau/stills/revision-03/`. Cost 2 credits, verified balance 982. Await still review before clips.

2026-09-14: Authorized revision-04 generated and inspected. Originals, prompt, source job and checksum saved. Balance 980 after 2 credits.

Latest status: Sean accepted Insights revision-04. Decision Support mechanical face correction completed in revision-05 after “continue”; awaits review. Current board: `designs/chateau/stills/revision-05/review.html`. Fresh context: `designs/chateau/HANDOFF.md`. Cost 2 credits; balance 978. No clips submitted.

Sean approved revision-05 and the completed key still set. Gate 3 complete. Next: gate 4 exterior clip; no video job submitted yet.
