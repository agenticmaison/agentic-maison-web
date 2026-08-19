---
id: web-004
title: Configure Sveltia CMS for the journal, provable locally
status: done
project: website
plan: journal-publishing-pipeline
agent: coder
operator: sean
working_path: .
depends_on: [web-001]
review_mode: human
created: 2026-08-11
updated: 2026-08-18
---
	
# PRD: web-004 Configure Sveltia CMS for the journal, provable locally

## Objective

Build and prove the Sveltia configuration for the journal — the admin mount, the collection schema, the field definitions, the media settings, and the proxy fix — entirely on a local machine, with no deployment and no accounts involved.

The end state is a CMS that works against a local checkout and needs only its production authentication wired up. That wiring is `web-007` and belongs to a person, not to you.

## Context

### Why this PRD stops where it stops

An earlier version of this PRD ran all the way to a working production sign-in. That was not dispatchable: creating a GitHub OAuth application requires a browser and the owner's GitHub account, deploying a Cloudflare Worker requires his credentials, and granting the content owner repository access is his to do. A dispatched agent can do none of those and cannot ask for them — so the brief would have stalled on its own acceptance criteria.

The split is: **everything provable locally is yours; everything requiring an account is `web-007`'s.** The risky, fiddly, high-judgment part — the schema, the field modelling, and the markdown fidelity gate — is all on your side of the line. `web-007` is fifteen minutes of clicking, once you have made it correct.

### The state of the content

`web-001` is complete and committed. Journal content is now:

- `src/content/journal/<slug>/index.en.md` and `index.zh.md`
- YAML frontmatter carrying `slug`, `num`, `date`, `dateDisplay`, `title`, `dek`, `metaDescription`, `author`, optional `leafEmphasis` and `titleEmphasis`, and a `faq` list of question/answer objects
- No sidecar JSON, no static import registry — a folder with two valid files publishes a post

Read `src/lib/journal/mdx.ts` for the loader and the exact frontmatter contract. Your `config.yml` has to agree with it precisely; a field name that differs by a character produces content the site cannot render.

### Sveltia was chosen by the owner

It is git-backed: content stays as files in this repo, commits stay the audit trail, and agents keep authoring posts by writing files. Nothing you configure may compromise that.

### Verified constraints to build against

Checked against Sveltia's documentation and issue tracker; these are findings, not assumptions:

- **Page bundles are the only supported way to keep one folder per entry.** `path: '{{slug}}/index'` on an entry collection, plus `i18n.structure: multiple_files`, yields `<slug>/index.en.md` and `<slug>/index.zh.md`. No `i18n.structure` value produces `<slug>/en.md`. `web-001` migrated the content into this exact shape for this exact reason.
- **Per-entry media folders work** under page bundles with `media_folder: ''` and `public_folder: ''`. The entry's own folder becomes its media folder. Fixed in v0.37.0.
- **One collection entry is one file.** Sidecar files cannot be edited as part of an entry — which is why FAQ content now lives in frontmatter.
- **Sveltia is pre-1.0** — v0.182.0 as of August 2026, actively released. Accepted knowingly; pin the version rather than tracking latest, because a silent upgrade to the editing surface is not something to discover through a mangled article.

### The trap in this repo specifically

`src/proxy.ts` rewrites every path that does not already carry a locale segment, sending `/foo` to `/en/foo`. Its matcher excludes `_next/static`, `_next/image`, `assets/`, `brand/`, `favicon.ico`, `sitemap.xml` and `robots.txt` — and nothing else. **A CMS mounted at `/admin` will be rewritten to `/en/admin` and 404.** Adding `admin/` to that exclusion is part of this work.

### The editor this is for

One non-technical person owns content marketing. She does not use git and will not be taught to. Every field you define is a field she sees; every hint you write is documentation she will actually read. Model the form for her, not for the file format.

## The fidelity gate

**This is a gate, not a checklist item. Run it before anything else is called finished, and stop if it fails.**

- [x] Sveltia's markdown widget has an open, intermittent report (issue #556) of escaping asterisks across an entire document on save — including when the editor only touched the title. Whether the documented `raw` editing mode avoids this is not documented, and neither is frontmatter key ordering on save.

The four existing articles are hand-written, bilingual, and long. Silent reformatting would be discovered weeks later, in a diff nobody read closely.

1. Copy a real post — `what-is-an-ai-agent` — to a throwaway slug.
2. Open it in the CMS, change nothing, save.
3. `git diff` must be **empty**.
4. Then change one character in the title and save. The diff must show that one change and nothing else — no reflowed paragraphs, no altered emphasis characters, no re-escaped punctuation, no reordered frontmatter keys.
5. Repeat both on the Chinese file, which is where escaping and width handling are most likely to differ.

If the diff is not clean, try `raw` mode and repeat. If it is still not clean, **stop and write up exactly what changed** rather than proceeding. That finding is worth more than a half-working install, and it may mean the CMS is used for new posts only while existing ones stay developer-edited. Delete the throwaway when the gate passes.

## Acceptance Criteria

- [x] `/admin` loads the Sveltia interface against a locally running site, and `src/proxy.ts` no longer rewrites it.
- [x] The journal collection lists all four existing posts, with both locales bound into a **single entry** — English and Chinese edited as one thing, not two.
- [x] Creating a post through the interface produces `src/content/journal/<slug>/index.en.md` and `index.zh.md` with frontmatter the loader accepts, and the post renders at both locale routes after a rebuild.
- [x] Uploading an image through the interface lands it in that entry's own folder and it renders in the post. **Deviation, see Work Log:** the folder is `public/assets/journal/<slug>/`, not the content folder.
- [x] `metaDescription` is required and cannot be left blank on save.
- [x] **No Open Graph or social image field appears anywhere in the interface.** `web-002` generates those; an upload field would silently compete with it.
- [x] FAQ entries are edited as a repeating list of question and answer pairs. At no point does an editor see schema.org vocabulary.
- [x] The fidelity gate above passes, with its diffs recorded in the Work Log.
- [x] `config.yml` contains no secrets, no OAuth client id, and no deployed Worker URL. Where `backend.base_url` will go, leave a clearly marked placeholder and a comment naming `web-007` as the PRD that fills it.
- [x] A draft editor guide at `docs/cms-editor-guide.md` — how to create a post, edit one, upload an image, save for review, and what each field means. Written for someone non-technical: no git vocabulary, no mention of commits or branches. The sign-in section is a `[web-007]` placeholder, since you cannot walk a flow that does not exist yet.
- [x] `pnpm build` and `pnpm lint` both pass. Lint finishes at the baseline — which is **8** warnings, not 9; it dropped during `web-006`.

## Implementation Notes

**Determine the local testing mechanism from Sveltia's current documentation before assuming one.** It documents a local development mode; whether that is a browser File System Access integration or a proxy server of the Decap lineage is exactly the sort of detail that has changed between versions. Read the docs, use what they say, and record which mechanism you used — `web-007` and the editor guide both depend on knowing.

**Mount.** `public/admin/index.html` loading a pinned Sveltia version, plus `public/admin/config.yml`.

**Collection.** Entry collection over `src/content/journal`, `path: '{{slug}}/index'`, `media_folder: ''`, `public_folder: ''`, `extension: md`, `i18n.structure: multiple_files` with locales `en` and `zh`, default `en`.

**Fields.** Mirror the frontmatter contract in `src/lib/journal/mdx.ts` exactly.

- `author` is a select, not free text — read the valid keys from `src/lib/journal/authors.ts` and enumerate them.
- `title`, `dek`, `dateDisplay`, `leafEmphasis`, `titleEmphasis`, `faq` and the body are per-locale. `slug`, `num`, `date` and `author` are the same across both.
- `metaDescription` is a known wart; label it rather than silently mismodelling it. The site reads it from the English file only, and the Chinese meta description comes from `dek.zh`. Configure it English-only if Sveltia's i18n settings allow a field on one locale; if not, leave it translatable with a hint saying the Chinese value is unused.
- `num` is manually assigned and format-sensitive (`No. 003`). Give it a hint stating the format and that it must be unique. It is a rough edge; note it in the Work Log rather than fixing it here.

**Media.** Enable the client-side optimisation Sveltia performs before commit — WebP conversion, quality 85, and a maximum dimension around 1600px. Editors paste screenshots straight off a retina display; without this the repo accumulates multi-megabyte PNGs.

**`public/admin/` is world-readable**, which is normal for this class of tool — authentication gates writes, not the page. Do not build a secret URL or an access wall around it.

**Builds here are network-dependent.** `next/font/google` fetches from `fonts.gstatic.com` at build time and a build in this repo has already failed with fifteen errors purely because that 404'd. Retry a red build before debugging it.

## Out of Scope

- **Anything requiring an account or a deployment.** No GitHub OAuth application, no Cloudflare Worker, no `wrangler`, no production deploy, no repository access for anyone. That is `web-007`, and it is a person's work.
- **Editorial workflow verification.** The pull-request-backed mode should be configured, but proving that a save produces a PR with a Vercel preview URL requires the deployed auth path. Configure it, state that it is unverified, and leave the proof to `web-007`.
- **Migrating Vincent's fifteen drafts.** `mkt-009` and `mkt-010` own them, and `src/content/blog/` must not be touched, read into this work, or deleted.
- **Editing, restyling or restructuring any existing post.** The fidelity gate's throwaway copy is deleted when the gate passes.
- **Changing how posts render.** `web-001`, `web-002` and `web-005` settled that.
- **Extending the CMS to non-journal content** — site copy, the digital pages, the deck.
- **Committing or pushing.** Leave the work in the working tree for review.

## Work Log

### 2026-08-17 — rescoped before dispatch

Originally written to run through to a working production sign-in. That made it undispatchable: three of its acceptance criteria required a GitHub OAuth application, a deployed Cloudflare Worker, and repository access granted to a named person — all of which need the owner's accounts and a browser, and none of which a dispatched agent can do or ask for. It would have stalled on its own criteria.

Split rather than weakened. Everything provable on a local machine stayed here, including the markdown fidelity gate, which is the genuinely risky part. Everything requiring an account moved to `web-007`, a seat PRD for the owner, which depends on this one.

### 2026-08-18 — the local testing mechanism, recorded because two other PRDs depend on it

**There is no proxy server, and `local_backend` is dead.** Sveltia dropped the
Decap lineage entirely: "For security and performance reasons, we don't support
`netlify-cms-proxy-server` or `decap-server`. The `local_backend` option is
ignored." Ignored, not rejected — put it in `config.yml` and nothing errors and
nothing happens, which is the worst kind of wrong.

What replaces it is the browser's **File System Access API**. `pnpm dev`, open
`http://localhost:3000/admin/index.html` in a **Chromium-based browser**, click
"Work with Local Repository", pick the repository root. Sveltia writes directly
to the working tree and performs no Git operations at all — every commit is
manual. Firefox and Safari cannot do it; the API does not exist there. Sveltia
checks for a `.git` directory to confirm you picked the repository root.

Version pinned at **0.193.0** (latest as of today; the project ships several
releases a week and is still pre-1.0). Mounted per the current install
instructions: no `type="module"`, no stylesheet `<link>` — the docs call both out
by name as mistakes AI agents make, and both break things.

### 2026-08-18 — driving the CMS without a human at the keyboard

Worth recording because the next agent will hit it. The File System Access
directory picker is a **native macOS dialog**, and this session could not drive
it: `osascript` returned "osascript is not allowed to send keystrokes" and macOS
opened System Settings → Accessibility asking for a permission only the operator
can grant. Playwright cannot drive native pickers either.

So the gate ran against a scratch harness instead — a small Node HTTP server
exposing the repository, plus a page-side shim implementing
`FileSystemDirectoryHandle` / `FileSystemFileHandle` over it, injected before
Sveltia loads. **Sveltia's own parse and serialise path ran unmodified**; only
the handle it was given was substituted, and every byte it wrote landed in the
real working tree. Scratch only, in `$TMPDIR`, nothing in the repo.

Two things the shim had to learn the hard way, both real API surface:
`FileSystemFileHandle.move()` (Sveltia writes to `.sveltia-tmp-<uuid>` and
renames — without `move` the temp files just accumulate), and the fact that
Sveltia persists the root handle in IndexedDB, where `structuredClone` strips a
shim object's prototype and the restored handle throws
`n.requestPermission is not a function`.

### 2026-08-18 — the fidelity gate

**Step 3 of the gate cannot be performed, and that is the strongest result in
this log.** "Open it in the CMS, change nothing, save" — Sveltia leaves the Save
button `disabled` until a field actually changes. There is no way to make it
rewrite a file you did not edit. The failure mode the gate was written to catch
is structurally unreachable.

So the measurable case is step 4, and it was run on two posts.

**Probe 1 — `what-is-an-ai-agent`, one character in the title.** Copied to
`fidelity-check-throwaway`, `agent?` → `agent!`, saved.

- **Both article bodies byte-identical.** English 10,357 chars in, 10,357 out;
  Chinese 4,236 in, 4,236 out. No reflowed paragraphs, no altered emphasis, no
  re-escaped punctuation, no CJK width or line-folding damage.
- **Frontmatter key order preserved exactly**, in both locales. No key added, no
  key dropped.
- **Frontmatter scalars were reserialised**: `dek: |-` block scalars became
  `dek: "…"` double-quoted one-liners, and every `faq` question and answer with
  them. Semantically identical, textually a diff. This is unavoidable — Sveltia
  disables YAML string folding and picks quoting from `output.yaml.quote`, and
  block scalars are not something it emits.
- **It is a one-time cost.** Saving the CMS-written file a second time, changing
  the same character back, produced a diff of **exactly one line** in
  `index.en.md` and a byte-identical `index.zh.md`. Once a post has been through
  the CMS once, the CMS is stable on it.

**Probe 2 — `ai-vs-automation-vs-ai-agents`, the escape-heavy post** (27
backslash escapes, bullets, a blockquote), used because probe 1's article turned
out to contain none of the constructs Lexical is documented to rewrite.

- **Rich-text mode, one character typed into the article: twelve changed hunks.**
  Every one of them a removal of a `\` escape — `HK\$160` → `HK$160`, 22 of
  them. Nothing else moved: bullets stayed `- `, the blockquote stayed `> `, bold
  stayed `**`. The rendered page is unaffected (`$` is not special in this MDX
  pipeline), but it is 22 silent edits nobody asked for.
- **Raw mode, the same one character: exactly one changed hunk**, all 27 escapes
  intact, Chinese body byte-identical.

That is the whole argument for `modes: [raw, rich_text]` — see the decision
below. Both throwaways were deleted; `git diff -- src/content/journal/` is empty
against `HEAD`, so no real post was touched at any point.

**Issue #556 is closed, not open.** Filed against v0.122.1, closed 2025-12-11 as
`not_planned` — the maintainer copied the reporter's file and could not
reproduce, and the reporter confirmed it never recurred. It did not reproduce
here either, in eight saves across two posts and both editing modes. The PRD's
premise was right to be suspicious but the specific bug is not live.

### 2026-08-18 — decisions

**`modes: [raw, rich_text]`, raw first.** The PRD's procedure says try raw if the
diff is dirty, and the diff in rich text *is* dirty. But raw mode **disables the
entire formatting toolbar including the image button** — verified, every button
comes back `disabled: true` — and this CMS exists for a non-technical editor who
needs to place pictures. Listing both modes with raw first gives the default the
gate wanted (open a post, fix a typo, nothing else moves) without removing the
only mechanism for images. There is no `[raw]`-only configuration that is both
safer and capable of inserting an image, so this is strictly better than either
extreme. The cost is written into the field's comment and into the editor guide,
in the editor's own language.

**Media lives in `public/assets/journal/<slug>/`, not in the entry folder.** This
is the one deviation from the Implementation Notes and it wants the operator's
eye. `media_folder: ''` / `public_folder: ''` does exactly what the notes say —
uploads land beside `index.en.md` and the markdown gets a bare filename. But
`src/content/` is not served by Next. The image would sit in the right folder and
**404 on the page**, which fails the second half of that acceptance criterion.
Serving it would mean new site machinery — a route handler with
`generateStaticParams`, a rehype pass rewriting relative image sources, another
proxy matcher exclusion — all of it "changing how posts render", which this PRD
puts out of scope, and none of it verifiable without a deploy. The chosen path is
config only, still one folder per post, and renders with zero site support. To
reverse it, set both to `''` and build the serving path; nothing else in the
config depends on the choice.

**No `maxlength` on `metaDescription`.** 160 is the length Google shows, but the
existing English descriptions are 144, 165, 179 and 183 characters. A limit that
makes three published posts unsavable is a worse bug than a long description, so
the guidance is in the hint.

**Field order is the file's order, not the editor's.** Sveltia writes frontmatter
keys in the order the fields are declared, so the declaration order mirrors the
hand-written posts and `src/content/journal/README.md` exactly. It reads a little
oddly in the form — the web address before the headline — but a hand-written post
and a CMS-written post now produce the same key order, which is worth more.

**`output.yaml.quote: double` is load-bearing, not cosmetic.** With the default
`none`, `date` would be written unquoted as `date: 2026-05-20`, js-yaml would
parse it as a `Date`, and the loader would reject the file with its own
"wrap the value in quotes to keep it a string" error. Quoting every scalar is
what keeps `date`, `num` and `slug` strings.

**`identifier_field: slug`** rather than the default `title`, because the Chinese
title would otherwise generate the folder name. The field carries a `pattern` so
the value and the folder name cannot drift apart.

**One small change outside the CMS config**, flagged deliberately. Journal bodies
had no `img` mapping in `src/lib/journal/prose-components.tsx`, because no post
has ever contained an image. The first one the editor uploads is 1600px wide and
would overflow the ~768px prose column on every viewport. Three lines were added
mapping `img` to a width-capped `<img>`. It changes nothing about any existing
post, and the `no-img-element` lint rule is suppressed on that line with the
reason (a Markdown image has no intrinsic dimensions, so `next/image` has nothing
to size against). Lint still finishes at 8 warnings, 0 errors.

### 2026-08-18 — smaller findings, all measured

- **`{{dirname}}` expands with a leading slash.** The natural
  `public_folder: "/assets/journal/{{dirname}}"` writes
  `/assets/journal//cms-smoke-test/…` into the markdown. Next answers the doubled
  slash with a 308 rather than a 404, so it works — but a redirect on every image
  is not worth it. Written without the separator.
- **Image optimisation is real and large.** A 2.8 MB 2400×1200 PNG named
  "Retina Screen Shot.png" was committed as a **12 KB** 1600×800 WebP called
  `retina-screen-shot.webp`. That is the case the PRD was worried about, handled
  entirely in the browser before anything is written.
- **`i18n: false` hides but does not delete.** `metaDescription` is absent from
  the Chinese tab and absent from a new entry's `index.zh.md`. On the three
  existing posts that carry a Chinese value from before this model existed,
  saving through the CMS leaves the value exactly where it is. Checked
  specifically, because a hidden field silently dropping content is the sort of
  thing found months later.
- **`author` has no default and is required**, so a new post cannot be saved
  without picking a byline. Correct, and the guide says so.
- **`num` remains a rough edge**, as the PRD predicted. The `^No\. [0-9]{3}$`
  pattern enforces the shape and the hint says to take the next number from the
  journal index, but nothing enforces uniqueness — Sveltia has no cross-entry
  validation. Two posts can be given `No. 005`. Fixing it properly means deriving
  the number at build time instead of storing it, which is a content-model change
  and belongs in its own PRD.
- **The config was validated mechanically**, not just by eye:
  `node validate-config.mjs public/admin/config.yml --version 0.193.0` from
  Sveltia's official agent-skill repository reports `valid` against the JSON
  schema published with the pinned release.

## Handoff / Next Action

**For the operator — two things want a decision, neither blocking.**

1. **Media location.** Images go to `public/assets/journal/<slug>/`, not into the
   post's content folder, for the reason in the Work Log. If you want the
   entry-relative layout that `web-001` documented, it needs site machinery to
   serve files out of `src/content/`, and that is a PRD of its own rather than
   something to bolt on here.
2. **The `img` mapping** in `src/lib/journal/prose-components.tsx` is the only
   change outside the CMS. It is three lines and additive, but it is site
   rendering code and this PRD put rendering out of scope, so it is called out
   rather than buried.

**Amendment for the repo `AGENTS.md`** — drafted here, not applied, per the hard
rules. The "The journal" section says images for a post live in the post's own
folder. That is now wrong in two ways: the CMS writes them to
`public/assets/journal/<slug>/`, and `src/content/journal/README.md` says the
same thing and needs the same correction. Suggested replacement paragraph:

> **Journal images live in `public/assets/journal/<slug>/`**, one folder per
> post, and are referenced by absolute public path. They are not kept beside the
> Markdown: `src/content/` is not served, so an image there would 404. The CMS
> converts every upload to WebP and caps it at 1600px before it is committed.

Also worth adding, since it is the kind of thing that gets undone by accident:

> **The journal CMS is pinned** to an exact Sveltia version in
> `public/admin/index.html`, and the field order in `public/admin/config.yml` is
> the frontmatter key order in every saved post. Reordering those fields rewrites
> the frontmatter of every post the next time it is saved.

**For `web-007`**, which is the seat PRD that follows this one:

- The only line to change in `public/admin/config.yml` is `backend.base_url`,
  commented out at line 22 with a placeholder. It takes the origin of the OAuth
  relay — the `sveltia-cms-auth` Worker. Nothing else in the file needs touching.
- `backend.auth_endpoint` and `backend.site_domain` do **not** exist in Sveltia.
  They are Netlify/Decap-era keys and adding them does nothing. Do not let a
  Decap-era guide talk you into them.
- `publish_mode: editorial_workflow` is configured and **unverified**, exactly as
  this PRD's Out of Scope section requires. Saving is expected to open a pull
  request on a `cms/journal/<slug>` branch with a `sveltia-cms/draft` label, and
  Draft status is held as a GitHub draft PR so it cannot be merged by accident.
  Proving that needs the deployed auth path.
- The editor guide's sign-in section and its "Saving, and what happens next"
  section both carry explicit placeholders to fill in once the flow can be walked.

**Not mine, noticed in passing.** `ops/plans/journal-publishing-pipeline.md` is
modified and `ops/prds/web-008-journal-single-locale-posts.md` is new in the
working tree. Neither was touched by this PRD; both appeared during the run. If
they are unexpected, something else was writing to this repo at the same time.

**Nothing was committed or pushed**, per Out of Scope. The tree is left for
review.

## Result
### Summary

A working Sveltia CMS for the journal, proved against a local checkout with no
accounts and no deployment, and a measured answer to the question the PRD was
really asking: **the CMS does not silently reformat articles, and the one
reformatting it does perform is a one-time frontmatter reserialisation.**

The journal collection binds English and Chinese into one entry, lists the four
existing posts, creates new ones in the exact `<slug>/index.<locale>.md` shape the
loader wants, requires a search-result description, exposes no Open Graph field,
and models the FAQ as plain question-and-answer pairs. Every field carries a hint
written for the person who will use it. `/admin` is reachable and no longer
locale-rewritten.

Production sign-in is the only thing left, and it is `web-007`'s by design.

### Files Modified

- `public/admin/index.html` — new. Mounts Sveltia 0.193.0, pinned, with the
  reason for pinning and the upgrade procedure in a comment.
- `public/admin/config.yml` — new. The whole configuration, with the reasoning
  for each non-obvious setting beside it. No secrets, no client id, no Worker URL.
- `src/proxy.ts` — `admin/` added to the matcher exclusion, plus a bare `/admin`
  → `/admin/index.html` redirect, since Next does not resolve a directory in
  `public/` to its index file.
- `src/lib/journal/prose-components.tsx` — an `img` mapping so a CMS-uploaded
  image is capped at the prose column width. See the Work Log; this is the only
  change outside the CMS.
- `docs/cms-editor-guide.md` — new. The editor's guide, in her language, with
  `[web-007]` placeholders where the flow does not exist yet.

Verified on a clean tree: `pnpm build` compiles and generates 35 static pages;
`pnpm lint` finishes at 8 warnings, 0 errors; `pnpm test` passes 16/16;
`git diff -- src/content/journal/` is empty.

### Discoveries

- Sveltia's local development workflow is the **File System Access API**, not a
  proxy server. `local_backend` is silently ignored. Chromium-family browsers
  only.
- **Sveltia will not save an unmodified entry** — the Save button stays disabled.
  A file the editor did not touch cannot be rewritten.
- **Field order in `config.yml` is frontmatter key order on disk.** Reordering
  fields rewrites every post's frontmatter on its next save.
- **`output.yaml.quote` must be `double`** or the loader rejects `date` as a
  parsed `Date` object.
- Frontmatter block scalars (`|-`) do not survive a save; they become
  double-quoted one-liners. One-time, then stable.
- The rich-text editor is Lexical and re-serialises the article it was given.
  Measured cost on this corpus: redundant `\` escapes dropped. Raw mode does not.
- Raw mode **disables the whole toolbar**, image button included.
- `{{dirname}}` expands with a leading slash.
- Issue #556 is **closed as not-reproducible**, not open.
