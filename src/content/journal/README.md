# Adding a new journal entry

Adding a post is a file drop. **No source file is edited.** Create the folder,
write `index.en.md`, and the entry route, journal index, homepage leaves and
sitemap all pick it up on the next build.

## 1. Create the folder

One folder per entry, named for the slug, holding one file per locale:

```
src/content/journal/<your-slug>/
  index.en.md      required
  index.zh.md      optional
```

**English is the post; Chinese is a translation of it.** A folder with only
`index.en.md` is a complete entry. Its `/zh/` route serves the English article,
marked as English and introduced by a short Chinese line saying the article is
English only, and both routes tell search engines the `/en/` URL is the canonical
one. A folder with no `index.en.md` is malformed and fails the build.

The `index.` stem and the `.en` / `.zh` suffix are not decorative. This is the
"page bundle" layout Sveltia CMS produces for an entry collection configured
with `path: '{{slug}}/index'` and `multiple_files` i18n. Renaming the files
breaks CMS editing.

**Images do not go in this folder.** `src/content/` is not served, so an image
here returns a 404. A post's images live in `public/assets/journal/<your-slug>/`
and are referenced by absolute public path — `/assets/journal/<your-slug>/x.webp`.

## 2. Write the frontmatter

Each file opens with a YAML frontmatter block between `---` delimiters. Each
locale carries its own locale's values.

```yaml
---
slug: "your-slug"                 # must match the folder name
date: "2026-06-01"                # ISO date — keep the quotes, or YAML makes it a date object
title: "Your title here"
description: |-
  One sentence describing the post. Aim for about 160 characters.
author: "sean"                    # key from src/lib/journal/authors.ts
faq:                              # optional — omit entirely for no FAQ block
  - question: |-
      A question a reader would actually type?
    answer: |-
      A direct answer, in prose.
---
```

That is the whole contract. `slug`, `date`, `title`, `description` and `author`
are required in every file present — a Chinese file, if there is one, is complete
or it is not there. `faq` is the only optional key. **Keep the keys in this
order**: it is the order `public/admin/config.yml` defines, and therefore the
order the CMS writes them in, so a post written by hand in any other order gets
reshuffled the first time an editor saves it.

`description` does two jobs with one sentence: it is the standfirst under the
title, the summary on the journal index card, and the description search engines
show. About 160 characters is the guidance — search results cut off past that —
but it is a hint in the CMS, not a limit: a longer description still saves.

## What is derived, and must not be written here

Two things that used to be frontmatter are now computed in
`src/lib/journal/entries.ts`, and there is nowhere to write them:

- **The issue number** (`No. 001`) counts up the date-ascending list of posts.
  Publishing a post dated before an existing one therefore renumbers everything
  after it — a deliberate trade for never having to assign a number by hand.
- **The displayed date** (`5 May 2026`, `2026年5月5日`) is formatted from `date`
  per locale.

Nothing downstream may format a date or number a post a second way.

Use the `|-` block scalar for anything prose-shaped. Nothing inside a block
scalar needs escaping, so colons, quotes and em dashes are all safe.

The `faq` list becomes a schema.org `FAQPage` JSON-LD block on the entry page,
in the order written. Omit the key and no block is emitted.

## 3. Write the body

Standard markdown below the closing `---`. `## Heading` and `### Heading` map to
the site's editorial styles and get anchor ids automatically. `---` on its own
line renders as a thin hairline rule.

Bodies are compiled through the MDX toolchain, so `{` and `<` are meaningful.
Escape them as `\{` and `\<` if you mean them literally.

## What the build checks

A malformed folder fails the build naming the slug and the problem. It catches a
missing `index.en.md`, unparseable YAML, a missing or non-string required key, a
`date` that is not a real `YYYY-MM-DD` day, and a `faq` entry missing its
question or answer. A missing `index.zh.md` is not
an error — it is an English-only post.

## Authors

Author data lives in `src/lib/journal/authors.ts`. Available keys: `sean`,
`vincent`. Add new authors there with a `name`, `bio` (bilingual), and `avatar`
path.
