# Chateau tour — handoff for a fresh agent

Updated 2026-09-15. Workspace: `/Users/sean/agentic-maison/unshared/website`. User: Sean. Read this first, then the linked project files. This is a continuation of an existing project, not a request to restart design or create a new task automatically.

## Latest authoritative state

Decision Support pass-04 is approved by Sean. Master: `clips/decision-support/pass-04/decision-support.mp4`, job `2298a07d-d1f3-492d-97c7-23b91b5e84e4`. Silver robot still revision-08 supersedes the older brass Decision Support still. Earlier pass-02 local fade edit and pass-03 generation are superseded. Sean now authorizes the first Insights video, using approved Insights revision-04 and continuing from Decision Support pass-04. Door transitions use forward camera movement and close wood occlusion, not applied fades. Preserve the standing Insights robot and populated holographic panels. Insights pass-01 has now been generated and is awaiting Sean review: `clips/insights/pass-01/review.html`, job `b2e00e03-f2cd-4933-a958-702593502a10`. Cost 65 credits; verified remaining balance 341.5. Opening already shows the room; exit ends on dark close wood detail. No regeneration authorized. Older next-step instructions below are historical.

## Current state and immediate next action

**Gates 1–5 complete. Sales: pass-01 generated; Sean then requested one correction (keep first 5 s, regenerate departure: door stays closed, camera passes through, ends black). pass-02 (start_image tail) had a visible jump at the 5 s join (diff 9.6). pass-03 regenerated the tail by forward video_extension of the real opening: `clips/sales/pass-03/sales.mp4`, join diff 6.0 (hold baseline ~1.2), content as directed; **Sean accepted pass-03 on 2026-09-15 ("looks good"). Sales master = `clips/sales/pass-03/sales.mp4`. Next: Decision Support clip prep; submit only on Sean's go.** On acceptance, next is the first Decision Support clip — requires Sean's explicit go; then stop for review.** Exterior pass-01 was accepted for continuation into the foyer. All five landscape stills are approved, including Decision Support revision-05 and Insights revision-04. No outstanding upload block or generation job.

Start by inspecting the approved foyer endpoint and Sales still, checking the live video model schema and cost, then preparing the Sales entrance → readable projection hold → exit shot. Keep sunlight from the left and make room geometry physically consistent. Preserve the blank projection for the real HTML Telegram/iPhone demo. Do not regenerate approved clips. The user is transferring context; do not create another task automatically.

Current still board: `stills/revision-05/review.html`. Approved motion: Exterior `clips/exterior/pass-01/exterior.mp4`; **Foyer `clips/foyer/pass-03/foyer.mp4` (assembled full clip, NOT departure.mp4 alone)**. Foyer review: `clips/foyer/pass-03/review.html`.

Sales clips: `clips/sales/pass-01/sales.mp4` (first pass, opening accepted, departure rejected) and `clips/sales/pass-02/sales.mp4` (assembled correction, pending review; see pass-02 `inspection.md`, `review.html`, `generation-record.json`). No Decision Support or Insights clips exist. No `/chateau` route implementation, portrait media, production WebP extraction, Blob upload, preview deployment or homepage promotion has happened. Frame samples and a local lossless clip assembly do exist.

## Canonical current stills

All paths below are relative to `designs/chateau/`. All current originals are 2688 × 1520 PNGs. Generation records include exact requests, references, job IDs, sizes and checksums.

| Scene | Current original | Higgsfield job | Status / direction |
| --- | --- | --- | --- |
| 01 Exterior | `stills/revision-02/scene-01-exterior.png` | `754cd62b-04c6-4d78-bcec-4628e16226e5` | Distant chateau low-right, elevated viewpoint, roughly 75% pale sky; dark floating hero copy at middle-left; no eyebrow |
| 02 Foyer | `stills/revision-01/scene-02-foyer.png` | `4dd80be6-a861-4d26-b773-5b749f4210ca` | No two hanging chandeliers; larger sphere supported in bronze cradle, visible wiring/floor routes |
| 03 Sales Ops | `stills/revision-01/scene-03-sales-ops.png` | `63bc2ff9-625c-40df-816d-2d627116e3c1` | Closer wall, larger blank projection; preserve for HTML demo |
| 04 Decision Support | `stills/revision-05/scene-04-decision-support.png` | `2790b67a-449e-44c0-8195-32653ef8a068` | Mechanical face correction complete; approved. Colour operations feeds retained |
| 05 Insights | `stills/revision-04/scene-05-insights.png` | `e62b8c59-b52a-4868-a308-965fecc83087` | Latest explicitly accepted by Sean: close robot/console shot, vivid populated holograms on both sides, no central blank screen |

## Latest scene decisions — override older instructions

- Lighting: welcoming warm late-afternoon daylight throughout, not eerie dusk or a green/blue film grade. Warm limestone, dark oak, aged brass, charcoal joints.
- Exterior: high/distant opening, chateau low-right; about 75% sky provides space for hero copy near the vertical band used in other sections. Remove “AI Consultancy · Hong Kong” hero eyebrow. Camera eventually descends and approaches the front door.
- Foyer: central sphere about 1.5 times original size, physically supported rather than floating, visibly wired to routes powering agents. Current wiring implies connections but does not fully show branching to all rooms.
- Sales: enlarged projection closer to camera; remains blank for real HTML Telegram/iPhone demonstration. Current angle requires perspective tracking and a square-enough reading hold in the later clip.
- Decision Support: front-facing seated robot, fully mechanical face matching Insights (revision-05, approved). Clearly physical colour television screens show trucks, factory, warehouse, retail and office operations. **No charts on these televisions.**
- Insights: retain revision-04. Robot close to console; closer camera avoids showing entire room width. Screens float across left, centre and right with visible graphs/charts/diagrams. No rear door. No blank central hero screen. The earlier empty room, right-only screens, clear left wall and blank central Insights HTML-plane requirements are superseded. One visible hand gestures; far hand is hidden from this angle. Tiny generated pseudo-labels are illustrative.
- Floating copy is real HTML on desktop AND mobile, never below the image/video. Use a local gradient scrim where necessary; do not remove left-side Insights screens to create a text wall. Current mobile review is a temporary cover crop of landscape, not final portrait composition.
- No film actor likenesses. Movie references guide architecture, robot design or gestures only.

## Product and implementation constraints

Full original brief: `brief.txt`. Approved storyboard and pacing: `visual-story.md` (read latest override at end). Build inside the existing Next.js repo, initially at `/chateau`, promoting to `/` only on explicit approval. AI consultancy for Hong Kong SMEs; digital website services are auxiliary.

One pinned 2D canvas draws pre-rendered WebP frames, scrubbed forward/back by native scrolling with GSAP ScrollTrigger and Lenis. No auto-play, video element, Three.js or Blender. Piecewise frame mapping by scene/beat, with holds mapping to a single frame. Additive scene architecture. No interstitial page content between rooms.

Door transitions dip to black. Room clips start at entrance and end at exit with settling moments. Insights can turn toward an off-camera side exit; its reading composition has no rear doorway. Final exit goes straight to CTA; no exterior bookend.

Approved pacing interpretation: exterior 300 CSS vh, foyer 250 vh, each room 200 vh, plus five 50 vh reading holds = 1,400 CSS vh total pinned travel. Tune only after integrated scroll review; do not confuse clip seconds with CSS vh.

Landscape target 1280×720 at 18fps; portrait 720×1280 at 18fps, separately generated after landscape approval, same cut/copy beats, responsive swap around 768px. Preserve masters. FFmpeg frame extraction in fresh scene staging folders. Frames hosted on Vercel Blob, not git, with verified manifests. Vercel defaults.

Real selectable DOM headings, copy, CTA, navigation and Sales hero-screen UI; ambient generated analytics allowed in Insights. Central Insights HTML screen requirement is removed by Sean's later direction. Use typed `content.ts` for copy, UI strings and manifests. Primary CTA: “Discuss your workflow”. Tour chrome: original logo and Skip tour; full nav after tour. Accessible reduced-motion stills, immediate poster, usable fallback links, bounded progressive loading/cache/concurrency, reverse-scroll/fast-jump/resize handling required.

## Review gates and authorization

1. Style tile / brand — approved.
2. Visual Story / pacing — approved.
3. Key stills — approved, including Insights revision-04 and Decision Support revision-05.
4. Exterior clip — approved for continuation, pass-01.
5. Foyer clip — approved, assembled pass-03.
6. Sales clip, then Decision Support clip, then Insights clip — each reviewed separately.
7. Integrated preview and scroll review.
8. Separate portrait production and review.
9. Explicit promotion to homepage.

Original Spend rule: ask before ANY regeneration and purchases. One targeted correction, no open-ended retry loops. First passes permitted within balance, subject to preceding review gate. Approval persists once given for a concrete pass. Use Higgsfield only; do not silently substitute another provider. Never start a trial or purchase.

## Tool workflow and costs

Last verified balance **640 credits** before pass-03; expected **607.5** after pass-03 extension (32.5) — re-verify with `balance`. First pass 10 credits; revision-01 five images 10; revision-02 three images 6; revision-03 Insights 2; revision-04 Insights 2; revision-05 Decision Support 2. Video spend: exterior78, foyer pass-01 65, foyer pass-02 65, foyer corrected departure32.5. Account had 1,010 after Sean enabled access. The earlier free account generation rejection created no job.

Higgsfield GPT Image 2: 16:9, resolution 2k, quality medium, count 1, use_unlim false, last cost 2 credits/image. Discover tools through ALL_TOOLS as needed. Call live `models_get` before every job, then exact `estimate_image_cost`. Single-image `generate_image` creates an auto-updating widget; do not redundantly display it. Save job ID immediately and poll `jobs_wait` at <=15 seconds respecting poll_after_seconds. Retrieve existing jobs before resubmission. Batch jobs require the batch gallery once terminal; use the display instructions returned by each submission.

References can be completed generation job UUIDs with role image. Completed Decision Support revision-05 used revision-02 target job 1f420a06-2199-45de-8759-c939c0a1da1c plus approved Insights as head reference only. Uploaded film gesture reference media ID: `11360600-d141-4182-9e1e-326a4b88bdb2`; preserved original at `stills/references/insights-gesture-reference.png`. Do not need to reupload it for the face change.

Download returned generated PNG via curl to its versioned review folder, preserving bytes. Network curl has required sandbox escalation with justification and prefix `["curl","--fail","--silent","--show-error","--location"]`. Inspect with view_image; save dimensions/byte size/SHA-256 and honest limitations. Never use shell image manipulation instead of generation for these edits. Do not include credentials or signed URLs in handoff/package.

## Brand, repo and verification

Read repo AGENTS.md, root `../../AGENTS.md`, AI practice `../../services/ai/AGENTS.md` where present. Before writing Next code read relevant local `node_modules/next/dist/docs/` guides. Use pageMetadata helper; never openGraph objects directly inside src/app. Retain real original wordmark, no redrawing. Dark #0e0d0a, cream #ece4d3, brass #b8895a/#d4a874, light ink #14110b. Cormorant Garamond headings, Source Serif 4 body, JetBrains Mono small labels. Original outlined Radley wordmark is embedded in review artifacts.

`style-tile.html` is editable standalone HTML/CSS with embedded font/logo assets and local still references. `.impeccable.md` contains design context. `ops/plans/chateau-tour.md` and `ops/prds/web-012...`, `web-013...`, `web-014-chateau-key-stills.md` track gates. All three still-stage PRDs are done; current next work is Sales motion. Older log entries remain historical; latest user direction wins.

Image vision and static HTML checks completed: PNG signatures, checksums, local links, unique IDs, anchors and checkbox labels. **Browser rendering and desktop/mobile visual QA have NOT been completed.** Agent-browser previously could not create its socket; in-app browser then explicitly blocked the local file URL under security policy. Do not bypass that rejection using an alternate URL/browser/CLI. Sean opens local files himself. Do not claim the board is browser-tested. FFmpeg 7.1.1/libwebp was available earlier; recheck before use.

No lint/typecheck/build run for this design-only work. Those are required at implementation gate. Builds fetch Google fonts and can fail transiently; repo says retry before debugging. Numerous unrelated untracked `src/content/blog/` files exist: leave untouched. No commits or deployment performed. No subagents needed or authorized.

## Approved motion and continuity

| Asset | Job / construction | Notes |
| --- | --- | --- |
| Exterior `clips/exterior/pass-01/exterior.mp4` | `8d30317a-8524-466c-bdee-990ec81073e2` | 12.041667s, 1280×720, 24fps, 289 frames, silent. Accepted dark corridor endpoint feeds Foyer. |
| Foyer source `clips/foyer/pass-02/foyer.mp4` | `412f82d2-bd76-42ac-8be5-32844d8b4a7d` | Only its first five seconds are retained in approved assembly. Its original departure is rejected. |
| Corrected tail `clips/foyer/pass-03/departure.mp4` | `4cef8f1b-f562-40bc-937c-3e2a452f2e11` | Five-second generated departure around RIGHT of sphere through single existing rear door, away from left windows. |
| Approved full Foyer `clips/foyer/pass-03/foyer.mp4` | First120 frames of pass-02 + generated tail | Lossless H.264 assembly; decoded hashes for all120 opening frames match source. Approved by Sean. **Decodes to exactly 240 frames (0–239); exact last frame = `clips/sales/pass-01/prep/foyer-final-frame-239.png`, uploaded by Sean as Higgsfield media `dc926752-9eb8-4389-8e1b-e4a7c84708e1`.** |
| Sales `clips/sales/pass-01/sales.mp4` | `24b44739-942c-4191-8b25-42a2977a0551` | 10.0417s, 1280×720, 24fps, 241 frames, silent. start_image = foyer frame 239 media, image reference = Sales still job. Hold ≈ frames 72–150 front-facing blank projection. Its departure (door swings open, camera never crosses) was rejected by Sean; only frames 0–119 are retained. |
| Sales corrected tail `clips/sales/pass-02/departure.mp4` | `5d9f2a8e-e530-4ff4-ac7f-17f70958200f` | 5 s from exact pass-01 frame 120 (media `af4f33d7-c0e0-499b-b071-54ac552e20c5`). Door stays closed; camera moves into it; image darkens to black. |
| Sales extension tail `clips/sales/pass-03/extended.mp4` | `81a2f4cb-35fb-421c-9928-60ccfbcee701` | Seedance video_extension forward, 5 s, from uploaded `opening.mp4` media `06b2ca64-bb19-4d5d-a15a-21c89691cdbc`. Returns tail only (120 frames). Door closed, into door, ends black. |
| Assembled Sales `clips/sales/pass-03/sales.mp4` | opening + extension | 240 frames; opening identical; join diff 6.0. **Accepted by Sean — Sales master.** |
| Assembled Sales `clips/sales/pass-02/sales.mp4` (superseded) | pass-01 frames 0–119 + tail | Lossless; first 120 decoded frames identical to pass-01; 241 frames; exact frame 240 is black (`pass-02/last-frame.png`). Pending Sean review. If accepted it is the Sales master and the Decision Support start reference should be its black final frame OR, more usefully, a frame chosen by inspection — a black start_image carries no room geometry, so consider starting Decision Support from its own entrance with the Sales still not needed; discuss with Sean. |

Approved Foyer route: start from exterior corridor endpoint → turn LEFT to reveal pre-existing foyer → supported/wired company brain hold → move around RIGHT side of sphere → existing single wooden door behind it, farthest from windows. Do not bring back the left-side departure, second door, materializing window/sphere or stone-edge exit.

The tail starts from exact decoded pass-02 frame120 at 00:00:05:00 (24fps, zero-based index). Uploaded reference `0c0a7d67-175f-41e7-b132-e7087debd2c3`. Exterior final frame288 was uploaded as `a2bc9892-8940-48b7-8749-2cc21b0b0588` for Foyer. The user favours passing the preceding clip's actual final frame as the next start reference. Use it for Sales if supported and appropriate; inspect the endpoint before choosing a next route.

**Endpoint extraction caveat:** `pass-03/last-frame.png` is a near-end sample extracted with -sseof -0.1, NOT a guaranteed exact last frame. Do not upload it as an exact endpoint. The assembled MP4 probe reports241 frames /10.000s /average241/10; attempting select frame240 yielded no PNG. Decode/count frames and inspect actual timestamps before extracting the final decoded frame. Normalize frame timing for production later; keep the approved pixels. Original videos and probe records remain available.

Agent verification was chronological frame samples and endpoints, not full real-time playback. Sean reviewed and approved the clip. Full runtime scroll smoothness and perspective tracking still require integration testing. Do not mistake approval for completed technical QA.

## Video workflow and permissions

Seedance 2.5 was used with mode omni_reference, 720p, 16:9, generate_audio false, bitrate_mode high, count1, use_unlim false. Last rates: 12s78 credits;10s65;5s32.5. Always recheck models_get and exact estimate_video_cost. Start reference role start_image; canonical image reference is mapped by tool to image_references. Save actual adjustments and job IDs immediately. No retries after uncertain submission until original outcome is retrieved.

A project-frame upload was once blocked by automatic approval review. Sean then explicitly authorized uploading the single 00:00:05:00 foyer frame to Higgsfield, and the retry succeeded. **That block is resolved; do not ask again for the already-uploaded frame.** This was specific authorization, not blanket permission for unrelated files. For any new upload use the documented upload/PUT/confirm path and comply with review. Do not bypass a rejection through another destination or tool. Uploaded media IDs can be reused; attachment-only helpers are not for agent-created files. Never save signed upload URLs or credentials.

Preserve originals and previous versions. Extract samples deterministically with FFmpeg. For joining this corrected tail the original opening was retained via trim=end_frame=120 and lossless libx264 qp0 concatenation; decoded framemd5 verifies preservation. The assembled file is a review master, not optimized delivery media. Later convert approved landscape to18fps WebP sequences and verify manifests, keeping originals.

## Session notes 2026-09-15 (Sales)

- Sean's direction for room clips: keep the continuity approach — pass the preceding clip's exact final decoded frame as `start_image` plus the approved room still as image reference; reveal the room by physical camera movement. Pacing per 10s room clip: ~0–3s entry, 3–6s demonstration, 6–10s departure and threshold crossing. Keep approved screen proportions. Off-frame left daylight, "restrained warm ambient light" (no chandelier-fill wording). Scroll-to-frame mapping is set after inspecting footage, not from visual-story defaults.
- Network: the session egress proxy refuses Higgsfield's S3 upload host and CloudFront result host (403) from both the cloud sandbox and the local workspace. Working path: agent extracts the frame; Sean uploads it via `media_upload_widget`; Sean downloads the result MP4 from Higgsfield into the pass folder; agent inspects locally with FFmpeg via device shell. Do not bypass.
- Join lesson: Seedance re-renders a start_image (framing/lighting drift, join diff ~9.6) and ignores 'begin still'; video_extension of the real clip is better (diff ~6) but still not seamless and outputs the tail only. Measure joins with tblend difference + signalstats before presenting. Plan rooms so the cut lands inside a dip to black where possible.
- `generate_video` may return a preset recommendation (e.g. "IN THE DARK") instead of a job; resubmit literally with `declined_preset_id`. That first call creates no job.
- device_stage_files cannot reach paths >7 folders below the connected folder; a `designs/chateau/_stage/` scratch copy is used for image inspection. `_stage/` and `clips/sales/pass-01/prep/_stage-tmp/` are disposable duplicates (agent lacks delete permission).

## Immediate Decision Support checklist (next)

1. Read this handoff, Decision Support still `stills/revision-05/scene-04-decision-support.png` (job `2790b67a-449e-44c0-8195-32653ef8a068`) and visual-story Room 2 beats.
2. Start reference: pass-02 ends on a black frame, so the continuity start_image approach gives the model nothing to continue from. Ask Sean how to begin Decision Support (e.g. start_image = last non-black Sales frame at the door, or begin at the Decision Support entrance using only the DS still as reference). Extract whichever frame is chosen exactly; Sean uploads it via the widget.
3. Prepare prompt: continue from the doorway, physical reveal of the monitor chamber, front-facing seated mechanical-faced robot, colour TVs showing operations (no charts), shallow arc, hold, unhurried exit through the single door with a real threshold crossing. Check live `models_get`, `get_cost`, balance. Present the exact request; submit only on Sean's go.

## Immediate Sales checklist (done 2026-09-15)

1. Read this handoff, `brief.txt`, relevant `visual-story.md` beats and Sales still `stills/revision-01/scene-03-sales-ops.png`.
2. Inspect/decode the approved assembled foyer endpoint; do not use the uncorrected pass-02 endpoint or assume near-end PNG is exact.
3. Prepare first Sales clip with left-side daylight, physically plausible entry, sufficiently front-on blank projection and reading hold, then visible exit. The screen will host selectable HTML Telegram/iPhone UI; no baked copy.
4. Check live model reference capabilities, cost and balance. First-pass generation is authorized within balance by the original brief after the preceding gate; no new regeneration/purchase authority is implied.
5. Generate one first pass, retrieve and inspect, preserve provenance, present for Sean review. Do not advance to Decision Support until Sales is approved.

## Suggested first message in the fresh context

“Continue from designs/chateau/HANDOFF.md. The still set, exterior and assembled Foyer pass-03 are approved. Next is the first Sales Ops clip. Preserve approved media and review gates; check live model capabilities and cost before generating.”

## Latest update: Decision Support transition edit

Sean reports Sales pass-03 finalized and silver Decision Support revision-08 robot supersedes prior brass design after an IP rejection. Source video clips/decision-support/pass-02/decision-support.mp4 exists. Local transition edit prepared at clips/decision-support/pass-02/transition-edit/review.html: source frames60–239,7.5s, fade-in0.75s, fade-out6.4–7.2s then black. Combined Sales tail preview included. No generation credits. Await Sean review; apply fades scroll-wise in final implementation and avoid double fades. Prior handoff next-step claims about Sales are superseded.
