/**
 * The table of contents must agree with the page.
 *
 * Every case here is a class of markdown where the old regex-plus-hand-rolled-
 * slugifier table of contents diverged from the ids `rehype-slug` actually put
 * on the rendered headings. The assertion is deliberately end-to-end: compile
 * the fixture, render the component to HTML, scrape the `h2`/`h3` ids out of
 * that HTML, and require the TOC to match it exactly. Nothing here asserts a
 * slug algorithm — if `github-slugger` changes its rules, these tests keep
 * passing, which is the point.
 *
 * Run with `pnpm test` (Node's built-in runner, with native TS stripping).
 */

import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { compileJournalMarkdown, type JournalHeading } from "./mdx.ts";

interface RenderedHeading {
  id: string;
  level: number;
}

/** The `h2`/`h3` ids in the rendered HTML, in document order. */
function renderedHeadings(html: string): RenderedHeading[] {
  return [...html.matchAll(/<h([23])[^>]*\sid="([^"]*)"[^>]*>/g)].map((m) => ({
    level: Number(m[1]),
    id: m[2],
  }));
}

function toc(headings: JournalHeading[]): RenderedHeading[] {
  return headings.map((h) => ({ level: h.level, id: h.id }));
}

/**
 * Compile a fixture, render it, and assert the TOC matches the page. Returns
 * both halves so a case can make its own extra assertions.
 */
async function compileAndCheck(markdown: string) {
  const { Content, headings } = await compileJournalMarkdown(markdown);
  const html = renderToStaticMarkup(createElement(Content));
  assert.deepEqual(
    toc(headings),
    renderedHeadings(html),
    "table of contents does not match the ids on the rendered headings"
  );
  return { headings, html };
}

test("repeated headings follow github-slugger's de-duplication", async () => {
  const { headings } = await compileAndCheck(
    ["## Examples", "", "One.", "", "## Examples", "", "Two."].join("\n")
  );
  assert.deepEqual(
    headings.map((h) => h.id),
    ["examples", "examples-1"]
  );
});

test("a link inside a heading slugs its rendered text, not its markup", async () => {
  const { headings, html } = await compileAndCheck(
    "## See [the docs](https://example.com)\n"
  );
  assert.deepEqual(
    headings.map((h) => h.id),
    ["see-the-docs"]
  );
  assert.equal(headings[0].text, "See the docs");
  assert.match(html, /<a href="https:\/\/example\.com">the docs<\/a>/);
});

test("an underscore survives into the id", async () => {
  const { headings } = await compileAndCheck("## snake_case matters\n");
  assert.deepEqual(
    headings.map((h) => h.id),
    ["snake_case-matters"]
  );
});

test("a `##` line inside a fenced code block is not a heading", async () => {
  const { headings, html } = await compileAndCheck(
    [
      "## Real heading",
      "",
      "```sh",
      "## This is a shell comment, not a heading",
      "```",
      "",
      "Body.",
    ].join("\n")
  );
  assert.deepEqual(
    headings.map((h) => h.id),
    ["real-heading"]
  );
  assert.match(html, /<code[^>]*>## This is a shell comment/);
});

test("setext headings appear, and only at the levels the TOC covers", async () => {
  const { headings, html } = await compileAndCheck(
    [
      "Setext level two",
      "----------------",
      "",
      "Body.",
      "",
      "Setext level one",
      "================",
      "",
      "More body.",
    ].join("\n")
  );
  // `---` underlines an h2, which belongs in the TOC. `===` underlines an h1,
  // which does not — the TOC has only ever covered h2 and h3.
  assert.deepEqual(
    headings.map((h) => h.id),
    ["setext-level-two"]
  );
  assert.match(html, /<h1 id="setext-level-one">/);
});

test("inline emphasis and inline code slug their text content", async () => {
  const { headings } = await compileAndCheck(
    [
      "## The **hard** part",
      "",
      "Body.",
      "",
      "### Set `x = 1` before **launch**",
      "",
      "Body.",
    ].join("\n")
  );
  // The first heading is the case that used to coincide by luck: stripping the
  // asterisks off the raw line happened to land on the same slug. The second is
  // the same construction one character of punctuation later, and it did not —
  // the removed `=` leaves a doubled separator that only the real slugger sees.
  assert.deepEqual(headings, [
    { id: "the-hard-part", text: "The hard part", level: 2 },
    { id: "set-x--1-before-launch", text: "Set x = 1 before launch", level: 3 },
  ]);
});

test("Traditional Chinese headings with CJK punctuation", async () => {
  const { headings } = await compileAndCheck(
    [
      "## 為什麼「AI 專案」會失敗？",
      "",
      "內文。",
      "",
      "### 三個階段：發現、試行、編排",
      "",
      "內文。",
      "",
      "## 為什麼「AI 專案」會失敗？",
      "",
      "內文。",
    ].join("\n")
  );
  // The ids are whatever github-slugger produces for CJK punctuation; the test
  // asserts the TOC matches the page (above), plus that de-duplication still
  // applies across a non-Latin script.
  assert.equal(headings.length, 3);
  assert.equal(headings[0].text, "為什麼「AI 專案」會失敗？");
  assert.equal(headings[2].id, `${headings[0].id}-1`);
  assert.notEqual(headings[0].id, "");
});

test("heading levels are read off the rendered element", async () => {
  const { headings } = await compileAndCheck(
    ["## Two", "", "Body.", "", "### Three", "", "Body."].join("\n")
  );
  assert.deepEqual(
    headings.map((h) => h.level),
    [2, 3]
  );
});
