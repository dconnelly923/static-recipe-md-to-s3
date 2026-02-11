const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const root = path.resolve(__dirname, "..");
const recipesDir = path.join(__dirname, "recipes");
const distDir = path.join(root, "dist");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stripTags(html) {
  return html.replace(/<[^>]*>/g, " ");
}

function formatMeta(category) {
  return category ? `<div class="meta">Category: ${category}</div>` : "";
}

function renderLayout({ title, content }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="page">
    <header class="site-header">
      <a class="logo" href="index.html">Connelly Recipes</a>
    </header>
    <main class="content">
      ${content}
    </main>
    <footer class="site-footer">
      <div>Generated from markdown</div>
    </footer>
  </div>
</body>
</html>`;
}

function writeStyle() {
  const css = `:root {
  --bg: #f7f1e8;
  --ink: #1f1b16;
  --accent: #9b3d2c;
  --muted: #6b5b4d;
  --card: #fffaf3;
  --border: #e7dccf;
  --shadow: rgba(31, 27, 22, 0.08);
  --radius: 16px;
  --font: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: var(--font);
  color: var(--ink);
  background: radial-gradient(circle at 20% 10%, #fff4e4, var(--bg));
}
.page {
  max-width: 860px;
  margin: 0 auto;
  padding: 32px 20px 60px;
}
.site-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
}
.logo {
  text-decoration: none;
  color: var(--ink);
  font-size: 28px;
  letter-spacing: 0.5px;
}
.tagline {
  color: var(--muted);
}
.content {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
  box-shadow: 0 18px 40px var(--shadow);
}
.recipe-title {
  margin-top: 0;
  font-size: 32px;
}
.meta {
  color: var(--muted);
  margin-bottom: 20px;
}
.recipe-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 16px;
}
.recipe-card {
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #fff;
}
.recipe-card a {
  color: var(--accent);
  text-decoration: none;
  font-size: 20px;
}
.recipe-card p {
  margin: 8px 0 0;
  color: var(--muted);
}
.site-footer {
  margin-top: 24px;
  color: var(--muted);
  font-size: 14px;
}
@media (max-width: 640px) {
  .content { padding: 18px; }
  .recipe-title { font-size: 26px; }
}
`;

  fs.writeFileSync(path.join(distDir, "style.css"), css, "utf8");
}

function build() {
  ensureDir(distDir);
  writeStyle();

  const files = fs.existsSync(recipesDir)
    ? fs.readdirSync(recipesDir).filter((f) => f.endsWith(".md"))
    : [];

  const recipes = files.map((file) => {
    const fullPath = path.join(recipesDir, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);
    const html = md.render(content);
    const title = data.title || path.basename(file, ".md");
    const slug = data.slug || slugify(title);
    const category = data.category || null;
    const excerpt = stripTags(html).trim().slice(0, 160);
    const recipeMeta = formatMeta(category);

    const page = renderLayout({
      title: `${title} | Family Recipes`,
      content: `
        <article>
          <h1 class="recipe-title">${title}</h1>
          ${recipeMeta}
          <div class="recipe-body">${html}</div>
        </article>
      `,
    });

    fs.writeFileSync(path.join(distDir, `${slug}.html`), page, "utf8");

    return {
      title,
      slug,
      category,
      excerpt,
      metaHtml: recipeMeta,
    };
  });

  recipes.sort((a, b) => (a.title > b.title ? 1 : -1));

  const listItems = recipes
    .map(
      (r) => `
        <li class="recipe-card">
          <a href="${r.slug}.html">${r.title}</a>
          ${r.metaHtml}
          <p>${r.excerpt}...</p>
        </li>`,
    )
    .join("");

  const indexContent = `
    <section>
      <h1 class="recipe-title">All Recipes</h1>
      <p class="meta">${recipes.length} recipe${recipes.length === 1 ? "" : "s"}</p>
      <ul class="recipe-list">
        ${listItems || "<li>No recipes yet.</li>"}
      </ul>
    </section>
  `;

  const indexPage = renderLayout({
    title: "Family Recipes",
    content: indexContent,
  });

  fs.writeFileSync(path.join(distDir, "index.html"), indexPage, "utf8");

  console.log(`Built ${recipes.length} recipes.`);
}

build();
