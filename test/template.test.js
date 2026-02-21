const { test } = require("node:test");
const assert = require("node:assert/strict");
const { formatMeta, renderLayout } = require("../src/lib/template");

test("formatMeta returns empty string when no category", () => {
  assert.equal(formatMeta(null), "");
  assert.equal(formatMeta(undefined), "");
  assert.equal(formatMeta(""), "");
});

test("formatMeta returns category div when category provided", () => {
  assert.equal(formatMeta("main"), '<div class="meta">Category: main</div>');
});

test("renderLayout includes the title in <title>", () => {
  const html = renderLayout({ title: "My Recipe", content: "" });
  assert.ok(html.includes("<title>My Recipe</title>"));
});

test("renderLayout includes the content in <main>", () => {
  const html = renderLayout({ title: "T", content: "<p>hello</p>" });
  assert.ok(html.includes("<p>hello</p>"));
});

test("renderLayout links stylesheet", () => {
  const html = renderLayout({ title: "T", content: "" });
  assert.ok(html.includes('href="style.css"'));
});

test("renderLayout links back to index", () => {
  const html = renderLayout({ title: "T", content: "" });
  assert.ok(html.includes('href="index.html"'));
});
