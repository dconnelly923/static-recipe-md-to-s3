const { test } = require("node:test");
const assert = require("node:assert/strict");
const { slugify, stripTags } = require("../src/lib/slugify");

test("slugify lowercases input", () => {
  assert.equal(slugify("Hello World"), "hello-world");
});

test("slugify replaces spaces with hyphens", () => {
  assert.equal(slugify("instant pot spaghetti"), "instant-pot-spaghetti");
});

test("slugify collapses multiple non-alphanumeric chars into one hyphen", () => {
  assert.equal(slugify("mac & cheese!"), "mac-cheese");
});

test("slugify strips leading and trailing hyphens", () => {
  assert.equal(slugify("  hello  "), "hello");
});

test("slugify handles already-clean input", () => {
  assert.equal(slugify("cornbread"), "cornbread");
});

test("stripTags removes HTML tags", () => {
  assert.equal(stripTags("<p>Hello <strong>world</strong></p>"), " Hello  world  ");
});

test("stripTags leaves plain text untouched", () => {
  assert.equal(stripTags("no tags here"), "no tags here");
});

test("stripTags handles self-closing tags", () => {
  assert.equal(stripTags("line<br />break"), "line break");
});
