const { test } = require("node:test");
const assert = require("node:assert/strict");
const md = require("../src/lib/markdown");

test("renders a heading", () => {
  assert.ok(md.render("## Ingredients").includes("<h2>Ingredients</h2>"));
});

test("renders a paragraph", () => {
  assert.ok(md.render("Hello world").includes("<p>Hello world</p>"));
});

test("renders an unordered list", () => {
  const html = md.render("- item one\n- item two");
  assert.ok(html.includes("<li>item one</li>"));
  assert.ok(html.includes("<li>item two</li>"));
});

test("renders an ordered list", () => {
  const html = md.render("1. first\n2. second");
  assert.ok(html.includes("<li>first</li>"));
});

test("passes through raw HTML (html: true)", () => {
  const html = md.render("<div class=\"foo\">bar</div>");
  assert.ok(html.includes('<div class="foo">bar</div>'));
});
