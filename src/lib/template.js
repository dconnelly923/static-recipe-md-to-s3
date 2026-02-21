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

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function formatMeta(category) {
  return category ? `<div class="meta">Category: ${toTitleCase(category)}</div>` : "";
}

module.exports = { renderLayout, formatMeta };
