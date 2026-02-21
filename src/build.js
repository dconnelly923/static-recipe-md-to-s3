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
