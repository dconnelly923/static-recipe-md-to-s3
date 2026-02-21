function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stripTags(html) {
  return html.replace(/<[^>]*>/g, " ");
}

module.exports = { slugify, stripTags };
