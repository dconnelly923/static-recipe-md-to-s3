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

function formatMeta(category) {
  return category ? `<div class="meta">Category: ${category}</div>` : "";
}

module.exports = { renderLayout, formatMeta };
