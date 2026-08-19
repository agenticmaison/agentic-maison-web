---
id: web-007
title: Wire Sveltia's production authentication and give the editor her seat
status: in_progress
project: website
plan: journal-publishing-pipeline
agent: mason
operator: sean
working_path: .
depends_on: [web-004]
review_mode: human
created: 2026-08-17
updated: 2026-08-19
---

# PRD: web-007 Wire Sveltia's production authentication and give the editor her seat

## Objective

Turn the locally-proven CMS from `web-004` into one the content owner can actually sign into, from a browser, on the deployed site — and confirm she can, by watching her do it once.

## Context

### This is a seat, not a dispatch

**This PRD does not spawn an agent.** `agent: mason` marks it as work the person named in `operator` does themselves, tracked here because `mkt-010` and the whole publishing pipeline depend on it. It leaves `queue` when the steps below are done, not because a worker reported back.

It exists as a separate PRD because every step needs an account only Sean holds, and a browser. A dispatched agent cannot create a GitHub OAuth application, cannot deploy to a Cloudflare account, and cannot grant anyone repository access — and, being unable to ask, would stall rather than fail cleanly. `web-004` was rescoped to stop at the boundary; this is the other side of it.

### What `web-004` will have left you

A configured CMS that works locally: the admin mount, the journal collection as a page bundle, the field schema, media settings, and the `src/proxy.ts` fix so `/admin` is not rewritten to `/en/admin`. `config.yml` will carry a clearly marked placeholder where `backend.base_url` belongs.

Its Work Log will record which local-development mechanism it used and whether the markdown fidelity gate passed. **Read that before starting.** If the gate did not pass cleanly, this PRD's assumptions change: the CMS may be for new posts only, and the editor guide has to say so.

### Why an OAuth relay is needed at all

Sveltia's default authentication path only works for Netlify-hosted sites. This site is on Vercel, so the documented route is deploying Sveltia's own `sveltia-cms-auth` Cloudflare Worker and pointing `backend.base_url` at it.

The alternative Sveltia offers is a GitHub personal access token pasted into browser local storage. **That is not acceptable here.** Avoiding exactly that friction is why a CMS is being installed: the editor's entire interaction with GitHub must be clicking one sign-in button. A flow that ends with her generating a token has failed, not fallen back.

### The editor

Kai owns content marketing. She does not use git and will not be taught to. She holds the vault but not this repository, and she does not have `unshared/` on her machine — so the site's code has never been visible to her, and this PRD is what makes the content reachable without it.

## Acceptance Criteria

- [ ] A GitHub OAuth application exists for this purpose, and where it lives, who owns it, and which account created it is written into this PRD's Result section. Undocumented infrastructure is forgotten infrastructure.
- [ ] `sveltia-cms-auth` is deployed as a Cloudflare Worker, and its URL, the account it sits in, and where its secrets are stored are all recorded in the Result section.
- [ ] `config.yml`'s `backend.base_url` points at the deployed Worker, with the placeholder removed.
- [ ] `/admin` loads the Sveltia interface on the **deployed** site, not just locally.
- [ ] The site still serves every other route normally, and the `src/proxy.ts` change did not disturb locale routing. Check the homepage, a journal entry in both locales, `/digital`, and the `/deck` unlock path.
- [ ] Kai has write access to `github.com/agenticmaison/agentic-maison-web`.
- [ ] **Kai signs in at `/admin` herself, while you watch**, and creates or edits one real thing. Not a demo account, not you signing in as her. Anything that trips her is a finding — record it.
- [ ] The sign-in flow required her to create **no personal access token** and to visit **no GitHub settings page**. If it did, the setup is wrong and this criterion has failed regardless of whether she got in.
- [ ] Saving without publishing produces a pull request that Vercel builds a preview URL for. `web-004` configures this but cannot prove it; include a real preview URL here.
- [ ] The `[web-007]` placeholder in `docs/cms-editor-guide.md` is replaced with the actual sign-in steps, written from what Kai did rather than from what you expected her to do.
- [ ] The editor guide is copied into the vault at `company/marketing/notes/` so Kai can read it from her own machine — this repository is not on it, and a guide she cannot open is not a guide.

## Implementation Notes

Follow Sveltia's own documentation for `sveltia-cms-auth` rather than a general OAuth tutorial; the Worker exists specifically for this and its README carries the exact configuration.

**Deploying the Worker is a live change**, unlike everything else in this initiative so far. Nothing else here touches production infrastructure.

**Watch Kai do it, do not describe it to her.** The whole premise of choosing a CMS over a shared folder was that she can operate it without learning git. That premise is a hypothesis until someone tests it, and the test is one person clicking through it once with you in the room. What she stumbles on is the most valuable output of this PRD — more than the Worker, which either works or does not.

**Do not write the guide from your expectations.** Write the sign-in section after watching, using the labels and screens that actually appeared.

## Out of Scope

- **Changing the collection schema, the field definitions, or `config.yml` beyond `backend.base_url`.** If the schema is wrong, that is a finding for a follow-on PRD, not an edit here — `web-004` proved it locally and changing it during an auth setup is how two problems become one confusing one.
- **Training Kai on the editorial standards** — voice, the Chinese adaptation rule, what makes a post publishable. That is marketing doctrine and it is not this PRD's business.
- **Triaging or publishing any of Vincent's fifteen drafts.** `mkt-010` owns that decision and it belongs to Kai.
- **Extending the CMS to non-journal content.**

## Work Log

### 2026-08-19 — infra steps started in a dedicated session
Seat PRD; Sean is executing the Worker deploy and OAuth wiring in a separate
working session (handoff doc in OS tmp). Cloudflare account: sean@agenticmaison.com,
created today. web-004/web-008/web-009 are done and committed, so the
`backend.base_url` edit is unblocked.

### 2026-08-19 — Worker deployed, OAuth app registered, config.yml wired
- Cloudflare `workers.dev` subdomain registered: `sean-c13` (chosen by Sean via
  the dashboard onboarding flow, distinct from the `agenticmaison` name he tried
  first — that name was unavailable).
- `sveltia/sveltia-cms-auth` cloned to a tmp dir and deployed via `wrangler
  deploy` under sean@agenticmaison.com. Worker URL:
  `https://sveltia-cms-auth.sean-c13.workers.dev`.
- GitHub OAuth app registered under the `agenticmaison` org. Client ID:
  `Ov23lidYinWV8git5NEo`. Callback: `<worker>/callback`. Secret set directly by
  Sean via `wrangler secret put GITHUB_CLIENT_SECRET` — never seen by this
  session.
- Worker secrets set: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`,
  `ALLOWED_DOMAINS` = `agenticmaison.com, *.agenticmaison.com` (locked to
  production only — no `*.vercel.app` wildcard, Sean's call, so PR preview
  sign-ins will not authenticate against this Worker until/unless revisited).
- `config.yml`: `backend.base_url` set to the Worker URL, placeholder removed.
  **Also found and fixed `backend.repo`**, which read `agenticmaison/website` —
  not the actual repo (`agenticmaison/agentic-maison-web`, confirmed with
  Sean). Left uncorrected, the CMS would have pointed at a nonexistent repo
  regardless of auth working. Treated as a bug blocking this PRD's acceptance
  criteria, not a schema change, so fixed in scope; flagged to Sean before
  editing. Committed as `e319518`.
- Kai's GitHub username: `Kagenticmaison` (has an account already; no account
  creation needed for step 5).
- Not yet done: push to `origin/main` and verify the deploy, grant Kai repo
  access, the live sign-in test, and the editor guide.

## Handoff / Next Action

## Result
### Summary

In progress. Worker deployed and OAuth app registered; not yet done: push,
Kai's access grant, live sign-in test, editor guide.

- **GitHub OAuth app:** `Sveltia CMS Authenticator`, registered under the
  `agenticmaison` org (not a personal account), by Sean. Client ID
  `Ov23lidYinWV8git5NEo`. Callback `https://sveltia-cms-auth.sean-c13.workers.dev/callback`.
- **Cloudflare Worker:** `sveltia-cms-auth`, deployed to account
  sean@agenticmaison.com, at `https://sveltia-cms-auth.sean-c13.workers.dev`.
- **Secrets:** `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ALLOWED_DOMAINS`
  stored as Cloudflare Worker secrets on `sveltia-cms-auth` (Workers dashboard
  → Settings → Variables, or `wrangler secret put`/`list`). Client secret was
  set directly by Sean; never recorded anywhere in this repo or vault.

### Files Modified

- `public/admin/config.yml` — `backend.base_url` set; `backend.repo` corrected
  from `agenticmaison/website` to `agenticmaison/agentic-maison-web`.

### Discoveries

- `config.yml`'s `backend.repo` was wrong (pointed at a repo that doesn't
  exist). Unrelated to auth, would have surfaced as a confusing failure after
  sign-in succeeded. Worth a note for whoever wrote it originally — not
  chasing further here.
