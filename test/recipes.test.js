const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { loadRecipes } = require("../src/lib/recipes");

function makeTmpDirs() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "recipes-test-"));
  const recipesDir = path.join(base, "recipes");
  const distDir = path.join(base, "dist");
  fs.mkdirSync(recipesDir);
  fs.mkdirSync(distDir);
  return { recipesDir, distDir };
}

function writeRecipe(dir, filename, frontmatter, body = "") {
  const content = `---\n${frontmatter}\n---\n\n${body}`;
  fs.writeFileSync(path.join(dir, filename), content, "utf8");
}

test("returns recipes sorted alphabetically by title", () => {
  const { recipesDir, distDir } = makeTmpDirs();
  writeRecipe(recipesDir, "z.md", "title: Zucchini Bread\ncategory: side");
  writeRecipe(recipesDir, "a.md", "title: Apple Cake\ncategory: side");

  const recipes = loadRecipes(recipesDir, distDir);

  assert.equal(recipes.length, 2);
  assert.equal(recipes[0].title, "Apple Cake");
  assert.equal(recipes[1].title, "Zucchini Bread");
});

test("skips files with category: template", () => {
  const { recipesDir, distDir } = makeTmpDirs();
  writeRecipe(recipesDir, "template.md", "title: Template\ncategory: template");
  writeRecipe(recipesDir, "chili.md", "title: Chili\ncategory: main");

  const recipes = loadRecipes(recipesDir, distDir);

  assert.equal(recipes.length, 1);
  assert.equal(recipes[0].title, "Chili");
});

test("writes an HTML file per recipe", () => {
  const { recipesDir, distDir } = makeTmpDirs();
  writeRecipe(recipesDir, "cornbread.md", "title: Cornbread\ncategory: side");

  loadRecipes(recipesDir, distDir);

  assert.ok(fs.existsSync(path.join(distDir, "cornbread.html")));
});

test("derives slug from title when not specified", () => {
  const { recipesDir, distDir } = makeTmpDirs();
  writeRecipe(recipesDir, "r.md", "title: Mac and Cheese\ncategory: main");

  const recipes = loadRecipes(recipesDir, distDir);

  assert.equal(recipes[0].slug, "mac-and-cheese");
  assert.ok(fs.existsSync(path.join(distDir, "mac-and-cheese.html")));
});

test("uses explicit slug from frontmatter", () => {
  const { recipesDir, distDir } = makeTmpDirs();
  writeRecipe(recipesDir, "r.md", "title: My Recipe\ncategory: main\nslug: custom-slug");

  const recipes = loadRecipes(recipesDir, distDir);

  assert.equal(recipes[0].slug, "custom-slug");
  assert.ok(fs.existsSync(path.join(distDir, "custom-slug.html")));
});

test("returns empty array when recipes directory is empty", () => {
  const { recipesDir, distDir } = makeTmpDirs();

  const recipes = loadRecipes(recipesDir, distDir);

  assert.deepEqual(recipes, []);
});

test("returns empty array when recipes directory does not exist", () => {
  const { distDir } = makeTmpDirs();
  const missing = path.join(os.tmpdir(), "does-not-exist-" + Date.now());

  const recipes = loadRecipes(missing, distDir);

  assert.deepEqual(recipes, []);
});

test("recipe HTML includes the title", () => {
  const { recipesDir, distDir } = makeTmpDirs();
  writeRecipe(recipesDir, "r.md", "title: Cornbread\ncategory: side", "## Ingredients\n\n- flour");

  loadRecipes(recipesDir, distDir);

  const html = fs.readFileSync(path.join(distDir, "cornbread.html"), "utf8");
  assert.ok(html.includes("Cornbread"));
});

test("recipe HTML includes rendered markdown body", () => {
  const { recipesDir, distDir } = makeTmpDirs();
  writeRecipe(recipesDir, "r.md", "title: Chili\ncategory: main", "## Instructions\n\n1. Cook it");

  loadRecipes(recipesDir, distDir);

  const html = fs.readFileSync(path.join(distDir, "chili.html"), "utf8");
  assert.ok(html.includes("<h2>Instructions</h2>"));
  assert.ok(html.includes("Cook it"));
});

test("excerpt is truncated to 160 characters", () => {
  const { recipesDir, distDir } = makeTmpDirs();
  const longBody = "word ".repeat(100);
  writeRecipe(recipesDir, "r.md", "title: Long Recipe\ncategory: main", longBody);

  const recipes = loadRecipes(recipesDir, distDir);

  assert.ok(recipes[0].excerpt.length <= 160);
});
