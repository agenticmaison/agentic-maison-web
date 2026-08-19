/**
 * English is required; Traditional Chinese is optional.
 *
 * These cases drive the loader against a fixture tree rather than the real
 * `src/content/journal/`, because two of the three shapes under test are ones
 * the build must reject — committing them to the content directory would fail
 * every build from then on. `JOURNAL_CONTENT_DIR` exists for exactly this, and
 * is set before `mdx.ts` is imported, so the module reads the fixtures when it
 * resolves its content directory at load time.
 *
 * What is *not* here, and why: the entry registry, the routes and the metadata
 * they compose live in `.tsx` files, and Node's test runner strips TypeScript
 * types but does not compile JSX, so it cannot import them. The pieces those
 * files depend on are covered here and in `../metadata/page-metadata.test.ts`;
 * the end-to-end behaviour of a real English-only entry on both routes was
 * verified against a production build, recorded in the web-008 PRD.
 *
 * Run with `pnpm test`.
 */

import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const FIXTURES = fs.mkdtempSync(path.join(os.tmpdir(), "web-008-journal-"));

function frontmatter(lang: "en" | "zh", slug: string): string {
  const en = {
    title: "A title in English",
    description: "An English standfirst.",
  };
  const zh = {
    title: "中文標題",
    description: "中文導言。",
  };
  const f = lang === "en" ? en : zh;
  return [
    "---",
    `slug: "${slug}"`,
    'date: "2026-06-01"',
    `title: "${f.title}"`,
    `description: "${f.description}"`,
    'author: "sean"',
    "faq:",
    `  - question: "${lang === "en" ? "An English question?" : "中文問題？"}"`,
    `    answer: "${lang === "en" ? "An English answer." : "中文答案。"}"`,
    "---",
    "",
    lang === "en" ? "## English heading" : "## 中文標題二",
    "",
    lang === "en" ? "English body text." : "中文內文。",
    "",
  ].join("\n");
}

function writeEntry(slug: string, langs: ("en" | "zh")[]): void {
  fs.mkdirSync(path.join(FIXTURES, slug), { recursive: true });
  for (const lang of langs) {
    fs.writeFileSync(
      path.join(FIXTURES, slug, `index.${lang}.md`),
      frontmatter(lang, slug)
    );
  }
}

writeEntry("bilingual", ["en", "zh"]);
writeEntry("english-only", ["en"]);
writeEntry("chinese-only", ["zh"]);
fs.mkdirSync(path.join(FIXTURES, "empty-folder"), { recursive: true });

process.env.JOURNAL_CONTENT_DIR = FIXTURES;
const mdx = await import("./mdx.ts");

test.after(() => fs.rmSync(FIXTURES, { recursive: true, force: true }));

test("a folder with only index.en.md is a complete entry", () => {
  assert.equal(mdx.hasEntryLocale("english-only", "en"), true);
  assert.equal(mdx.hasEntryLocale("english-only", "zh"), false);
  // Discovery does not care how many locales an entry has.
  assert.deepEqual(mdx.getJournalSlugs().sort(), [
    "bilingual",
    "chinese-only",
    "empty-folder",
    "english-only",
  ]);
});

test("the zh route of an English-only entry is served by the English file", async () => {
  assert.equal(mdx.sourceLocale("english-only", "zh"), "en");

  // Everything the zh page renders comes from index.en.md: metadata, body and
  // the FAQ that becomes the FAQPage JSON-LD.
  const meta = mdx.parseRawMeta(
    "english-only",
    mdx.sourceLocale("english-only", "zh")
  );
  assert.equal(meta.title, "A title in English");
  assert.equal(meta.description, "An English standfirst.");

  const { Content, headings } = await mdx.compileJournalBody(
    "english-only",
    mdx.sourceLocale("english-only", "zh")
  );
  const html = renderToStaticMarkup(createElement(Content));
  assert.match(html, /English body text\./);
  assert.deepEqual(
    headings.map((h) => h.text),
    ["English heading"]
  );

  const faq = mdx.getFaqJsonLd(
    "english-only",
    mdx.sourceLocale("english-only", "zh")
  ) as { mainEntity: { name: string }[] };
  assert.equal(faq.mainEntity[0].name, "An English question?");
});

test("the en route of an English-only entry is unremarkable", async () => {
  assert.equal(mdx.sourceLocale("english-only", "en"), "en");
  const { Content } = await mdx.compileJournalBody("english-only", "en");
  assert.match(
    renderToStaticMarkup(createElement(Content)),
    /English body text\./
  );
});

test("a bilingual entry is unaffected: each locale still reads its own file", async () => {
  assert.equal(mdx.sourceLocale("bilingual", "zh"), "zh");
  assert.equal(mdx.sourceLocale("bilingual", "en"), "en");
  assert.equal(mdx.parseRawMeta("bilingual", "zh").title, "中文標題");
  assert.equal(mdx.parseRawMeta("bilingual", "en").title, "A title in English");

  const { Content } = await mdx.compileJournalBody("bilingual", "zh");
  const html = renderToStaticMarkup(createElement(Content));
  assert.match(html, /中文內文。/);
  assert.doesNotMatch(html, /English body text/);

  const faq = mdx.getFaqJsonLd("bilingual", "zh") as {
    mainEntity: { name: string }[];
  };
  assert.equal(faq.mainEntity[0].name, "中文問題？");
});

test("a folder with no index.en.md fails, naming the slug and the file", () => {
  // English is the required locale — not "at least one locale". A zh-only
  // folder is the shape most likely to be created by accident, and it is the
  // one the build must refuse.
  assert.throws(
    () => mdx.parseRawMeta("chinese-only", "en"),
    (error: Error) => {
      assert.match(error.message, /Journal content error/);
      assert.match(error.message, /"chinese-only"/);
      assert.match(error.message, /has no index\.en\.md/);
      assert.match(error.message, /index\.zh\.md is optional/);
      return true;
    }
  );
  // And the fallback never rescues it: en does not fall back to anything.
  assert.equal(mdx.sourceLocale("chinese-only", "en"), "en");
  assert.equal(mdx.hasEntryLocale("chinese-only", "en"), false);
});

test("an empty folder fails the same way", () => {
  assert.throws(
    () => mdx.parseRawMeta("empty-folder", "en"),
    /"empty-folder" has no index\.en\.md/
  );
});
