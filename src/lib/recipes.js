const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const md = require("./markdown");
const { slugify } = require("./slugify");
const { renderLayout, formatMeta } = require("./template");

function loadRecipes(recipesDir, distDir) {
  const files = fs.existsSync(recipesDir)
    ? fs.readdirSync(recipesDir).filter((f) => f.endsWith(".md"))
    : [];

  const recipes = files.map((file) => {
    const fullPath = path.join(recipesDir, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);
    const category = data.category || null;
    if (category === "template") return null;

    const title = data.title || path.basename(file, ".md");
    const slug = data.slug || slugify(title);
    const description = data.description || null;
    const html = md.render(content);
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

    return { title, slug, category, description, metaHtml: recipeMeta };
  }).filter(Boolean);

  recipes.sort((a, b) => (a.title > b.title ? 1 : -1));

  return recipes;
}

module.exports = { loadRecipes };
