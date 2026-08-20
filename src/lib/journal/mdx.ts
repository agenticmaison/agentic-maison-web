/**
 * Content pipeline for journal entries.
 *
 * Reads `src/content/journal/` at build time. Each entry is a folder named for
 * its slug holding `index.en.md` and, optionally, `index.zh.md` — the "page
 * bundle" layout Sveltia CMS produces for an entry collection with
 * `path: '{{slug}}/index'` and `multiple_files` i18n. Metadata is YAML
 * frontmatter; the body below it is markdown compiled through the MDX
 * toolchain.
 *
 * Adding an entry is a file drop. Nothing here is registered by hand, and a
 * malformed folder fails the build naming the slug and the problem.
 *
 * ## English is required; Traditional Chinese is optional
 *
 * `index.en.md` is the entry. A folder without one is malformed and fails the
 * build, exactly as before. `index.zh.md` is a translation of it: when the file
 * is absent the `/zh/` route serves the English text rather than 404ing, and
 * that resolution happens here — `sourceLocale()` — rather than by writing a
 * duplicate file at build time. There is never more than one live copy of a
 * post's text.
 *
 * Callers that render a page ask `sourceLocale(slug, locale)` which file backs
 * it, and `hasEntryLocale(slug, 'zh')` whether that page is a translation or a
 * fallback — the second question has visible consequences (`lang` attributes,
 * `hreflang`, the sitemap) and so is deliberately not hidden inside the reader.
 */

import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import matter from "gray-matter";
import { evaluate, type EvaluateOptions } from "@mdx-js/mdx";
import type { MDXContent } from "mdx/types";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import * as jsxRuntime from "react/jsx-runtime";

/**
 * Where entries are read from.
 *
 * `JOURNAL_CONTENT_DIR` exists so the tests can point the loader at a fixture
 * tree — the alternative is committing deliberately broken folders to
 * `src/content/journal/`, where the build would find them. It is not a
 * deployment knob: nothing sets it outside `*.test.ts`.
 */
const CONTENT_DIR = process.env.JOURNAL_CONTENT_DIR
  ? path.resolve(process.env.JOURNAL_CONTENT_DIR)
  : path.join(process.cwd(), "src/content/journal");

export type JournalLocale = "en" | "zh";

/** One question/answer pair from the optional `faq` frontmatter list. */
export interface JournalFaqItem {
  question: string;
  answer: string;
}

/**
 * Frontmatter of a single locale file.
 *
 * Every key here is something a person has to decide. What can be derived is
 * derived — the issue number from date order, the displayed date from `date` —
 * and lives on the assembled entry in `entries.ts`, never in a file an editor
 * edits.
 */
export interface JournalMdxMeta {
  slug: string;
  date: string;
  title: string;
  /** One sentence. Shown on the index card and as the search-result text. */
  description: string;
  author: string;
  /** Source for the FAQPage JSON-LD block. Absent or empty emits nothing. */
  faq?: JournalFaqItem[];
}

/** Frontmatter keys every locale file must carry, as non-empty strings. */
const REQUIRED_KEYS = [
  "slug",
  "date",
  "title",
  "description",
  "author",
] as const;

/** The only shape `date` may take, now that display dates are derived from it. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Midnight UTC on an already-shape-checked `YYYY-MM-DD`. */
function utcDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Whether `YYYY-MM-DD` names a day that exists — 2026-02-30 does not. */
function isRealDate(iso: string): boolean {
  const date = utcDate(iso);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === iso;
}

/**
 * The displayed date for one locale, derived from `date`.
 *
 * `5 May 2026` in English, `2026年5月5日` in Chinese — the two forms the posts
 * carried by hand before this was derived, reproduced exactly. `timeZone: UTC`
 * is load-bearing: a bare `YYYY-MM-DD` is midnight UTC, and formatting it in a
 * machine-local timezone west of Greenwich prints the day before.
 *
 * Two `Intl` details here were measured, not assumed, and both produce a
 * plausible near-miss when got wrong:
 *
 * - `zh-Hant`, not `zh-HK`. `zh-HK` orders the parts day-first and prints
 *   `5/5/2026`.
 * - `month: 'long'` in both locales. It is what makes Chinese render `年月日`
 *   rather than `2026/5/5`; `numeric` looks like the obvious choice for a
 *   language that has no month names, and is wrong.
 */
export function formatEntryDate(iso: string, lang: JournalLocale): string {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-Hant" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(utcDate(iso));
}

/**
 * The issue number for the entry at `index` of the date-ascending list.
 *
 * Callers pass a position in the sorted set, never a per-entry guess: an entry
 * cannot know its own number without knowing what was published before it.
 * Three digits, matching the `No. 001` the posts carried by hand.
 */
export function formatIssueNumber(index: number): string {
  return `No. ${String(index + 1).padStart(3, "0")}`;
}

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
    // Only `en` can legitimately be missing-and-fatal. A missing `zh` never
    // reaches here: callers resolve through `sourceLocale()` first, so asking
    // for one that is not there is a programming error, and says so.
    throw new Error(
      lang === "en"
        ? `Journal content error — "${slug}" has no index.en.md. ` +
          "Every folder under src/content/journal/ needs an index.en.md; " +
          "index.zh.md is optional, and an entry without one serves its " +
          "English text on the /zh/ route."
        : `Journal content error — "${slug}" has no index.${lang}.md, and it was ` +
          `read without going through sourceLocale("${slug}", "${lang}").`
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

  // `date` is no longer just sorted on: the issue number and both displayed
  // dates are computed from it, so a value Date cannot parse would reach the
  // page as "Invalid Date" rather than as a build failure.
  if (!ISO_DATE.test(data.date as string) || !isRealDate(data.date as string)) {
    throw contentError(
      slug,
      lang,
      `frontmatter key \`date\` must be a real calendar date written as YYYY-MM-DD (got "${String(data.date)}").`
    );
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
 * Whether this entry has a source file for `lang`.
 *
 * `hasEntryLocale(slug, 'en')` is false only for a malformed folder — the
 * question worth asking is `hasEntryLocale(slug, 'zh')`, which is false for an
 * English-only entry and drives everything the reader can see about it.
 */
export function hasEntryLocale(slug: string, lang: JournalLocale): boolean {
  return fs.existsSync(entryFilePath(slug, lang));
}

/**
 * Which locale's file backs a request for `lang`.
 *
 * `zh` falls back to `en`; `en` never falls back, so a folder with no
 * `index.en.md` still fails loudly at the read below rather than quietly
 * rendering the other language.
 */
export function sourceLocale(
  slug: string,
  lang: JournalLocale
): JournalLocale {
  if (lang === "en") return "en";
  return hasEntryLocale(slug, lang) ? lang : "en";
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

/** One entry in a journal post's table of contents. */
export interface JournalHeading {
  /** The id `rehype-slug` put on the rendered heading — read, never recomputed. */
  id: string;
  /** The heading's rendered text content, markup flattened away. */
  text: string;
  level: 2 | 3;
}

/** A compiled journal body together with the headings that body emitted. */
export interface CompiledJournalBody {
  Content: MDXContent;
  headings: JournalHeading[];
}

/**
 * The two fields the heading walk reads off a hast node.
 *
 * `@types/hast` reaches this repo only as a transitive dependency of
 * `rehype-slug`, and pnpm's isolated `node_modules` does not expose transitive
 * packages to application code. Declaring the shape locally is cheaper than
 * adding a direct dependency for two type imports.
 */
interface HastNodeLike {
  type: string;
  tagName?: string;
  value?: string;
  properties?: { id?: unknown };
  children?: HastNodeLike[];
}

/** Mirrors `hast-util-to-string`: concatenate descendant text nodes. */
function nodeText(node: HastNodeLike): string {
  if (node.children) return node.children.map(nodeText).join("");
  return node.type === "text" && typeof node.value === "string"
    ? node.value
    : "";
}

/**
 * A rehype plugin that records the `h2`/`h3` headings of one document.
 *
 * Run it *after* `rehype-slug` and it reads the id `rehype-slug` has already
 * assigned rather than deriving its own. That ordering is the whole fix: there
 * is exactly one slugger in the pipeline, the table of contents never calls it,
 * and a TOC id cannot drift from the id on the heading it points at — including
 * for `github-slugger`'s stateful de-duplication of repeated headings, which a
 * second slugger instance would restart and get wrong.
 */
function createHeadingCollector(): {
  headings: JournalHeading[];
  plugin: () => (tree: unknown) => void;
} {
  const headings: JournalHeading[] = [];

  function walk(node: HastNodeLike): void {
    if (
      node.type === "element" &&
      (node.tagName === "h2" || node.tagName === "h3")
    ) {
      const id = node.properties?.id;
      // A heading with no usable id gets no TOC entry: a link to nowhere is
      // worse than a missing line. `rehype-slug` assigns one to every heading,
      // so this only fires if content hard-codes a non-string id.
      if (typeof id === "string" && id !== "") {
        headings.push({
          id,
          text: nodeText(node),
          level: node.tagName === "h2" ? 2 : 3,
        });
      }
    }
    node.children?.forEach(walk);
  }

  return {
    headings,
    plugin: () => (tree: unknown) => {
      walk(tree as HastNodeLike);
    },
  };
}

/**
 * Compile a markdown body into a React component and its table of contents.
 *
 * Both come out of one pass over one tree, so they cannot disagree. Exported
 * so the heading tests can drive it with fixtures instead of real entries.
 */
export async function compileJournalMarkdown(
  body: string,
  baseUrl?: string
): Promise<CompiledJournalBody> {
  const runtime = jsxRuntime as unknown as Pick<
    EvaluateOptions,
    "Fragment" | "jsx" | "jsxs"
  >;
  const collector = createHeadingCollector();
  const { default: Content } = await evaluate(body, {
    ...runtime,
    // GFM, for tables above all: CommonMark has no table syntax, so a
    // well-formed pipe table renders as literal pipe-delimited prose without
    // this. It also brings strikethrough, autolinks, task lists and footnotes.
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, collector.plugin],
    baseUrl,
  });
  return { Content, headings: collector.headings };
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
): Promise<CompiledJournalBody> {
  const { body } = readEntryFile(slug, lang);
  return compileJournalMarkdown(
    body,
    pathToFileURL(entryFilePath(slug, lang)).href
  );
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
