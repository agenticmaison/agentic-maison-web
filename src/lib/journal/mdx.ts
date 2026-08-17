/**
 * Content pipeline for journal entries.
 *
 * Reads `src/content/journal/` at build time. Each entry is a folder named for
 * its slug holding `index.en.md` and `index.zh.md` — the "page bundle" layout
 * Sveltia CMS produces for an entry collection with `path: '{{slug}}/index'`
 * and `multiple_files` i18n. Metadata is YAML frontmatter; the body below it is
 * markdown compiled through the MDX toolchain.
 *
 * Adding an entry is a file drop. Nothing here is registered by hand, and a
 * malformed folder fails the build naming the slug and the problem.
 */

import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import matter from "gray-matter";
import { evaluate, type EvaluateOptions } from "@mdx-js/mdx";
import type { MDXContent } from "mdx/types";
import rehypeSlug from "rehype-slug";
import * as jsxRuntime from "react/jsx-runtime";

const CONTENT_DIR = path.join(process.cwd(), "src/content/journal");

export type JournalLocale = "en" | "zh";

/** One question/answer pair from the optional `faq` frontmatter list. */
export interface JournalFaqItem {
  question: string;
  answer: string;
}

/** Frontmatter of a single locale file. */
export interface JournalMdxMeta {
  slug: string;
  num: string;
  date: string;
  dateDisplay: string;
  title: string;
  dek: string;
  metaDescription?: string;
  author: string;
  /** Substring of `title` to wrap in `<em>` on the landing-page leaf. */
  leafEmphasis?: string;
  /** Substring of `title` to wrap in `<em>` in the entry page h1. */
  titleEmphasis?: string;
  /** Source for the FAQPage JSON-LD block. Absent or empty emits nothing. */
  faq?: JournalFaqItem[];
}

/** Combined metadata for an entry (both languages merged). */
export interface JournalEntryData {
  slug: string;
  num: string;
  date: string;
  dateDisplay: { en: string; zh: string };
  title: { en: string; zh: string };
  dek: { en: string; zh: string };
  metaDescription: string;
  author: string;
}

/** Frontmatter keys every locale file must carry, as non-empty strings. */
const REQUIRED_KEYS = [
  "slug",
  "num",
  "date",
  "dateDisplay",
  "title",
  "dek",
  "author",
] as const;

/** Frontmatter keys that may be absent but must be strings when present. */
const OPTIONAL_STRING_KEYS = [
  "metaDescription",
  "leafEmphasis",
  "titleEmphasis",
] as const;

function entryFilePath(slug: string, lang: JournalLocale): string {
  return path.join(CONTENT_DIR, slug, `index.${lang}.md`);
}

function contentError(
  slug: string,
  lang: JournalLocale,
  problem: string
): Error {
  return new Error(
    `Journal content error — src/content/journal/${slug}/index.${lang}.md: ${problem}`
  );
}

/** `typeof` alone is unhelpful once js-yaml has turned a bare date into a Date. */
function describe(value: unknown): string {
  if (value === undefined) return "missing";
  if (value === null) return "null";
  if (value instanceof Date) {
    return "a date — wrap the value in quotes to keep it a string";
  }
  if (Array.isArray(value)) return "a list";
  return `a ${typeof value}`;
}

interface ParsedEntryFile {
  meta: JournalMdxMeta;
  body: string;
}

const fileCache = new Map<string, ParsedEntryFile>();

/**
 * Read, parse and validate one locale file. Throws — with the slug and the
 * specific problem — on a missing file, unparseable YAML, a missing or
 * non-string required key, or a malformed `faq` list. This is what replaces the
 * old import-registry assertion and the old FAQ JSON schema check.
 */
function readEntryFile(slug: string, lang: JournalLocale): ParsedEntryFile {
  const cacheKey = `${slug}/${lang}`;
  const cached = fileCache.get(cacheKey);
  if (cached) return cached;

  const filePath = entryFilePath(slug, lang);
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Journal content error — "${slug}" has no index.${lang}.md. ` +
        "Every folder under src/content/journal/ needs both index.en.md and index.zh.md."
    );
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(raw);
  } catch (cause) {
    throw contentError(
      slug,
      lang,
      `frontmatter is not valid YAML — ${(cause as Error).message}`
    );
  }

  const data = parsed.data as Record<string, unknown>;
  if (!raw.trimStart().startsWith("---")) {
    throw contentError(
      slug,
      lang,
      "no YAML frontmatter block. The file must open with a `---` delimiter."
    );
  }

  for (const key of REQUIRED_KEYS) {
    const value = data[key];
    if (typeof value !== "string" || value.trim() === "") {
      throw contentError(
        slug,
        lang,
        `frontmatter key \`${key}\` is required and must be a non-empty string (got ${describe(value)}).`
      );
    }
  }

  for (const key of OPTIONAL_STRING_KEYS) {
    if (key in data && typeof data[key] !== "string") {
      throw contentError(
        slug,
        lang,
        `frontmatter key \`${key}\` must be a string when present (got ${describe(data[key])}).`
      );
    }
  }

  if ("faq" in data && data.faq != null) {
    if (!Array.isArray(data.faq)) {
      throw contentError(
        slug,
        lang,
        `frontmatter key \`faq\` must be a list of { question, answer } entries (got ${describe(data.faq)}).`
      );
    }
    data.faq.forEach((item: unknown, index: number) => {
      const position = `faq entry ${index + 1}`;
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        throw contentError(
          slug,
          lang,
          `${position} must be a mapping with \`question\` and \`answer\` (got ${describe(item)}).`
        );
      }
      for (const field of ["question", "answer"] as const) {
        const value = (item as Record<string, unknown>)[field];
        if (typeof value !== "string" || value.trim() === "") {
          throw contentError(
            slug,
            lang,
            `${position} is missing a non-empty \`${field}\` (got ${describe(value)}).`
          );
        }
      }
    });
  }

  if (parsed.content.trim() === "") {
    throw contentError(slug, lang, "the body below the frontmatter is empty.");
  }

  const entry: ParsedEntryFile = {
    meta: data as unknown as JournalMdxMeta,
    body: parsed.content,
  };
  fileCache.set(cacheKey, entry);
  return entry;
}

/**
 * Get all journal entry slugs by scanning the content directory.
 */
export function getJournalSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

/**
 * Extract headings (h2, h3) from markdown content for table of contents.
 * Parses `## Heading` and `### Heading` from raw text.
 */
export function extractHeadings(
  mdxContent: string
): { id: string; text: string; level: 2 | 3 }[] {
  const headings: { id: string; text: string; level: 2 | 3 }[] = [];
  const lines = mdxContent.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length as 2 | 3;
      const text = match[2].trim();
      // Generate slug matching rehype-slug behavior
      const id = text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      headings.push({ id, text, level });
    }
  }

  return headings;
}

/**
 * Markdown body of one locale file, with the frontmatter stripped.
 */
export function getEntryBody(slug: string, lang: JournalLocale): string {
  return readEntryFile(slug, lang).body;
}

/**
 * Parse and validate the frontmatter of one locale file at build time.
 */
export function parseRawMeta(
  slug: string,
  lang: JournalLocale
): JournalMdxMeta {
  return readEntryFile(slug, lang).meta;
}

/**
 * Compile one locale's markdown body into a React component.
 *
 * Uses the same MDX toolchain the `@next/mdx` loader was using, with the same
 * `rehype-slug` plugin, so heading anchor ids are unchanged. Content is
 * repo-controlled and compiled at build time; the caller supplies the component
 * mapping through the returned component's `components` prop.
 */
export async function compileJournalBody(
  slug: string,
  lang: JournalLocale
): Promise<MDXContent> {
  const { body } = readEntryFile(slug, lang);
  const runtime = jsxRuntime as unknown as Pick<
    EvaluateOptions,
    "Fragment" | "jsx" | "jsxs"
  >;
  const { default: Content } = await evaluate(body, {
    ...runtime,
    rehypePlugins: [rehypeSlug],
    baseUrl: pathToFileURL(entryFilePath(slug, lang)).href,
  });
  return Content;
}

/**
 * Build the schema.org FAQPage JSON-LD from an entry's `faq` frontmatter.
 * Returns null when the locale file carries no FAQ entries.
 */
export function getFaqJsonLd(
  slug: string,
  lang: JournalLocale
): Record<string, unknown> | null {
  const { faq } = readEntryFile(slug, lang).meta;
  if (!faq || faq.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
