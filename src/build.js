const fs = require("fs");
const path = require("path");
const { resetDir } = require("./lib/fs");
const { loadRecipes } = require("./lib/recipes");
const { renderLayout } = require("./lib/template");

const root = path.resolve(__dirname, "..");
const recipesDir = path.join(__dirname, "recipes");
const distDir = path.join(root, "dist");

function build() {
  resetDir(distDir);

  const css = fs.readFileSync(path.join(__dirname, "lib/style.css"), "utf8");
  fs.writeFileSync(path.join(distDir, "style.css"), css, "utf8");

  const recipes = loadRecipes(recipesDir, distDir);

  const CATEGORY_ORDER = ["main", "side", "sauce", "seasoning"];
  const CATEGORY_LABELS = { main: "Mains", side: "Sides", sauce: "Sauces", seasoning: "Seasonings" };

  const byCategory = {};
  for (const r of recipes) {
    const cat = r.category || "";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(r);
  }

  const sections = CATEGORY_ORDER
    .filter((cat) => byCategory[cat])
    .map((cat) => {
      const items = byCategory[cat]
        .map((r) => `
          <li class="recipe-card">
            <a href="${r.slug}.html">${r.title}</a>
            ${r.description ? `<p>${r.description}</p>` : ""}
          </li>`)
        .join("");
      return `
        <section class="category-section">
          <h2 class="category-heading">${CATEGORY_LABELS[cat]}</h2>
          <ul class="recipe-list">${items}</ul>
        </section>`;
    })
    .join("");

  const indexContent = `
    <section>
      <h1 class="recipe-title">All Recipes</h1>
      ${sections || "<p>No recipes yet.</p>"}
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
