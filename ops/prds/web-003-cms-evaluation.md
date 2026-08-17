---
id: web-003
title: CMS evaluation and recommendation for the journal
status: cancelled
project: website
plan: journal-publishing-pipeline
agent: researcher
operator: sean
working_path: .
depends_on: []
review_mode: human
created: 2026-08-11
updated: 2026-08-11
---

# PRD: web-003 CMS evaluation and recommendation for the journal

## Objective

Produce one written recommendation naming a single content management system for the Agentic Maison journal, with the reasoning, the rejected alternatives, and an explicit list of what the recommended option **cannot** do — so the owner can decide once rather than discovering the constraints during installation.

## Context

### The decision this feeds

Content marketing is owned by someone who is not a developer and does not hold the website repository. She needs to create articles, correct a published one without a round trip through the repo owner, and set SEO metadata in fields she cannot forget to fill. The current answer is that publishing is a developer task, which is why four articles are live and fifteen drafts are not.

`web-001` is refactoring journal content to `.md` files with YAML frontmatter, in a folder per slug, discovered from the filesystem with no source-code registry. **Evaluate against that target state, not against what is in the repo today.** The refactor is fully specified and does not need to have landed for this evaluation to be accurate.

### Target stack, stated precisely

- Next.js 16, App Router, deployed on Vercel. Repo `github.com/agenticmaison/agentic-maison-web`, GitHub org owned by us.
- Content at `src/content/journal/<slug>/` containing `en.md` and `zh.md` — **two locale files inside one folder**, plus `faq-en.json` and `faq-zh.json` sidecars, plus an optional `assets/` folder.
- Frontmatter keys: `slug`, `num`, `date`, `dateDisplay`, `title`, `dek`, `metaDescription`, `author`, and optional `leafEmphasis` and `titleEmphasis`.
- Bilingual English and Traditional Chinese, where the Chinese is a genuine adaptation rather than a translation. A post shipping in one language only is a defect.
- Two editors, of whom one is non-technical. Roughly twenty articles today.
- Open Graph images are generated in code by `web-002` and must **not** appear as an editor-facing field.

### The non-negotiable

Content must remain files in git. Agents in this operation author and edit content by writing files, with git history as the audit trail. Any system that moves content into a database breaks that, and the burden of proof is on it. This is the reasoning that already put Payload behind the git-backed options — do not re-derive it from scratch, but do state honestly if you find it wrong.

### Research already done — do not repeat it

Sveltia CMS has been researched once already and these findings can be taken as given, though flag anything you find that contradicts them:

- Media uploads commit into the repo through the GitHub API, configured with `media_folder` / `public_folder`. Client-side optimisation before commit: raster to WebP at configurable quality (default 85), resize to a max dimension, SVGO on SVGs. Asset library with nested folders, previews, and rename-with-reference-update. Stock photo search via Pexels, Unsplash and Pixabay. External storage backends — S3, R2, Cloudinary, Uploadcare — are described inconsistently across the docs and should be treated as in-flight rather than settled.
- No concept of an OG image beyond an ordinary image field.
- `i18n.structure` supports five modes including `multiple_files`, which matches the `en.md` / `zh.md`-in-one-folder layout.
- On Vercel, the default Netlify OAuth path does not work; the documented route is deploying `sveltia-cms-auth`, a Cloudflare Worker, and pointing `backend.base_url` at it. The alternative is a GitHub personal access token held in browser local storage.
- Mounts statically as `public/admin/index.html` plus `config.yml`.
- Pre-1.0 at v0.182.0 as of August 2026, actively released, 1.0 targeted late 2026.
- Parses YAML, TOML and JSON frontmatter only. Full MDX with JSX in the body is unimplemented.

## Acceptance Criteria

- [ ] A single memo at `research/cms-evaluation.md` that **names one recommendation** in its first paragraph. Not a balanced survey — a decision, argued.
- [ ] Keystatic, Sveltia and Payload are each assessed. Decap and TinaCMS are covered at least briefly, with a stated reason for dismissal if they are dismissed.
- [ ] Every candidate is scored against all nine criteria in the Implementation Notes below, with a source URL behind each factual claim.
- [ ] A section listing what the recommended option **cannot** do — the constraints we would be accepting, and for each one whether we live with it, build around it, or change our content shape to suit it.
- [ ] A specific finding on the FAQ sidecar question in the Implementation Notes. This is the criterion most likely to be quietly skipped and it is the one most likely to force a content-shape change.
- [ ] A concrete answer to what the non-technical editor's login actually looks like, step by step, on Vercel — including anything she would have to do inside GitHub's own interface, if anything.
- [ ] Anything that could not be verified is marked as unverified rather than smoothed over.

## Implementation Notes

Assess every candidate against these nine, in roughly this order of weight:

1. **Can it edit our files as they are?** Folder per slug, two locale `.md` files in that folder, YAML frontmatter with the keys listed above. If it requires a different layout, say exactly what layout and how big a change that is.
2. **Does it model the two locales as one entry**, so a post cannot be published half-translated? Or are English and Chinese two independent entries with nothing binding them?
3. **The FAQ sidecars.** `faq-en.json` and `faq-zh.json` live beside the markdown in the same folder. Most git-backed systems map one collection entry to one file. Can these be edited at all, as part of the same entry? If not, the options are moving FAQs into frontmatter, or leaving them uneditable by the CMS — say which the candidate forces.
4. **Authentication on Vercel.** What has to be stood up, who hosts it, what it costs, and — the part that actually matters — whether a non-technical editor can log in without ever opening GitHub's own settings. A flow that ends in "generate a personal access token" fails this criterion.
5. **Draft and review workflow.** Can an editor save without publishing? Does that produce a branch or pull request that Vercel builds a preview URL for? A preview link the owner can open and approve is worth a great deal here and no other approach offers it.
6. **Media handling for body images** — where uploads land, whether they are optimised, and whether the editor can reuse an existing image.
7. **Agent compatibility.** After installation, can an agent still create a post by writing files directly, with no API client and no credentials? Anything that answers no is disqualified, not downgraded.
8. **Maturity and risk.** Release cadence, version, whether it is production-ready, size of the maintaining team, and what the exit looks like if it is abandoned.
9. **Cost** — recurring, per editor, and any hosting the system drags in with it.

**Do not install anything and do not modify the repo outside `research/`.** This is a decision input.

Where two candidates are genuinely close, say so and name the tie-break rather than manufacturing a gap.

## Out of Scope

- **Installing, configuring or prototyping any CMS.** A follow-on PRD does that once the owner has chosen.
- **Making the decision.** The memo recommends; the owner decides.
- **Notion, Google Drive, or a plain shared folder as the editing surface.** Already considered and rejected — none offers structured SEO fields, and Notion's asset URLs expire.
- **Image CDNs and external media hosting.** Repo-committed images are the decided approach at this volume.
- **Anything about the fifteen drafts in `src/content/blog/`.** They are `mkt-009` and `mkt-010`'s.

## Work Log

### 2026-08-11 — cancelled before dispatch

The owner chose Sveltia CMS directly, so the comparison this PRD would have produced has no decision left to inform. Never dispatched; nothing was written to `research/`.

The nine evaluation criteria in Implementation Notes are not wasted — they are the checklist Sveltia now has to be held against during installation, and questions 1, 3 and 5 in particular (file layout, the FAQ sidecars, and the draft/preview workflow) are constraints rather than preferences. They were folded into `web-004` rather than discarded.

`working_path` changed from `research` to `.` on 2026-08-17. The `research/` directory was created solely to receive this PRD's memo, was never written to, and has since been removed — leaving a cancelled PRD generating a standing checker warning about a path that exists for no other reason.

## Handoff / Next Action

## Result
### Summary

### Files Modified

### Discoveries
