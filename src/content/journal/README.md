# Adding a new journal entry

Adding a post is a file drop. **No source file is edited.** Create the folder,
write the two locale files, and the entry route, journal index, homepage leaves
and sitemap all pick it up on the next build.

## 1. Create the folder

One folder per entry, named for the slug, holding one file per locale:

```
src/content/journal/<your-slug>/
  index.en.md
  index.zh.md
```

The `index.` stem and the `.en` / `.zh` suffix are not decorative. This is the
"page bundle" layout Sveltia CMS produces for an entry collection configured
with `path: '{{slug}}/index'` and `multiple_files` i18n. Renaming the files
breaks CMS editing. Images for a post go in this same folder — the entry folder
is its own media folder.

## 2. Write the frontmatter

Each file opens with a YAML frontmatter block between `---` delimiters. Each
locale carries its own locale's values.

```yaml
---
slug: "your-slug"                 # must match the folder name
num: "No. 005"                    # display identifier, assigned by hand
date: "2026-06-01"                # ISO date — keep the quotes, or YAML makes it a date object
dateDisplay: "1 June 2026"        # human-readable, localized per file
title: "Your title here"
dek: |-
  One-sentence summary for the index card.
metaDescription: |-
  SEO meta description. Read from the English file only.
author: "sean"                    # key from src/lib/journal/authors.ts
leafEmphasis: "word"              # optional — substring of title to emphasize on the homepage leaf
titleEmphasis: "word"             # optional — substring to emphasize in the entry h1
faq:                              # optional — omit entirely for no FAQ block
  - question: |-
      A question a reader would actually type?
    answer: |-
      A direct answer, in prose.
---
```

`slug`, `num`, `date`, `dateDisplay`, `title`, `dek` and `author` are required
in **both** files. `metaDescription`, `leafEmphasis`, `titleEmphasis` and `faq`
are optional.

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
missing locale file, unparseable YAML, a missing or non-string required key, and
a `faq` entry missing its question or answer.

## Authors

Author data lives in `src/lib/journal/authors.ts`. Available keys: `sean`,
`vincent`. Add new authors there with a `name`, `bio` (bilingual), and `avatar`
path.
