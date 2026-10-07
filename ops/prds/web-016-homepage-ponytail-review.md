---
id: web-016
title: Simplify the promoted homepage with ponytail
status: done
project: website
plan: chateau-tour
agent: coder
operator: sean
working_path: .
review_mode: self
created: 2026-10-07
updated: 2026-10-07
---

# Simplify the promoted homepage with ponytail

## Objective

Review the new homepage using ponytail in full mode, trace its rendering and interaction flow, and apply small, justified YAGNI fixes. The tour has moved from the chateau route to the locale root, served from `src/app/[locale]/page.tsx`; its client component and CSS remain in `src/app/[locale]/chateau/`. The previous homepage is archived at `src/app/[locale]/old/page.tsx`. The user explicitly authorized promotion and this background review. Work directly on branch chateau-tour in the existing working tree.

Own only the new homepage entry, its tour component and CSS, and the tour modules and tests under `src/lib/chateau/`. Read shared chrome and its callers, but record proposed shared-chrome changes instead of editing outside your ownership. Preserve the current visuals, copy, pacing, frame assets, contact actions, reduced-motion and failed-load fallbacks, keyboard access, and English-only canonical metadata. The previous homepage and unrelated dirty files are outside scope. Existing edits are intentional; inspect the current tree rather than restoring HEAD. You are not alone in the codebase. Never revert another author's edits.

Read the root doctrine, the coder role and required skills, website AGENTS.md, .impeccable.md, unslop, frontend-design and ponytail. Read relevant Next.js guides from the installed node_modules/next/dist/docs before editing Next code. Website instructions describing the former SheetShell homepage now apply to the archive; this task does not redesign the approved tour. Use existing dependencies and helpers. No new abstractions, dependencies, asset regeneration, deployment, pushing, or commits in this task. Leave changes in the working tree as requested by Sean. Document consequential simplifications and any blocked or deferred finding in this record. See [[chateau-tour]] for the initiative.

## Acceptance Criteria

- [x] Review the homepage and its complete tour loading, timeline, rendering and cleanup flow; record findings and apply safe simplifications where justified.
- [x] Preserve homepage metadata, intended visuals and interactions, accessible fallbacks, and unrelated work.
- [x] Run the production build, test suite, typecheck and lint, and record actual output summaries and any failures. For new nontrivial logic, leave one focused runnable check.
- [x] Record changed paths, reductions and verification in Result; return unresolved material findings through Handoff / Next Action.

## Work Log

- Traced the promoted server page through the client tour: `page.tsx` retains locale validation and English-only metadata; the AVIF probe gates frame requests; reduced-motion and AVIF failure use poster stills; the frame loader gates scroll on the first scene, bounds concurrency and retries, and disposes with the pinned ScrollTrigger, Lenis ticker, subscriptions and ResizeObserver. Timeline-derived overlays and visibility redraws remain necessary. No safe reductions were justified in that lifecycle.
- Corrected the menu paths in `src/lib/chateau/content.ts`: The Maison now targets `/` in both menu variants, and the non-tour Contact link targets `/#after-tour`. Kept the tour menu's existing `#after-tour` anchor. In `CopyBlock`, stopped rendering an empty hero support paragraph; it had no content and no layout role.
- `pnpm test` → `# tests 43`, `# pass 43`, `# fail 0`, `# duration_ms 441.934458` (exit 0).
- `pnpm lint` → `✖ 8 problems (0 errors, 8 warnings)` (exit 0); warnings are existing `<img>` notices in `src/app/deck/page.tsx` and `src/components/hero-mechanism-layers.tsx`.
- `pnpm exec next typegen && pnpm exec tsc --noEmit` → `Generating route types...` / `✓ Types generated successfully`; `pnpm exec tsc --noEmit` exited 0 with no diagnostics.
- `git diff --check -- src/app/[locale]/chateau/chateau-tour.tsx src/lib/chateau/content.ts` completed without errors.
- `pnpm build` (Mason's run outside the sandbox) exited 1 after 67 `Connection timed out when requesting https://fonts.gstatic.com/...` errors and follow-on font module resolution errors. The log ends `ELIFECYCLE Command failed with exit code 1`. The full log is `/tmp/am-chateau-build.log`; no route regression was reported.
- Mason's post-edit HTTP checks confirmed the tour renders for `/en` and `/zh`, the archived page remains available on both locales, `id="after-tour"` is present, and the hero has no empty support paragraph. `git diff --check` also passed. The dev server was not reachable from this worker for an independent HTTP check.

- Mason retried `pnpm build` with network access. Exit 0: `Compiled successfully in 4.8s`, TypeScript finished in 4.2s, and `Generating static pages using 9 workers (45/45) in 2.4s`. The route table includes the locale root and `/[locale]/old`, with no chateau route. This clears the remaining production-build check.

## Result

Changed `src/app/[locale]/chateau/chateau-tour.tsx` and `src/lib/chateau/content.ts`. Removed one empty paragraph from the rendered hero and repaired three menu destinations. The loader, timeline, overlays, reduced-motion and failed-load fallbacks, keyboard actions, metadata, assets and approved tour presentation remain intact. No new logic needed a focused check. The production build, tests, lint and typecheck pass.
