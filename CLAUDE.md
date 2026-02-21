# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run build     # generate static site into dist/
npm run clean     # remove dist/
npm test          # run unit tests (node:test, no extra dependencies)
```

After building, open `dist/index.html` locally to preview.

## Architecture

This is a minimal static site generator that converts recipe markdown files to a deployable HTML site.

**Build pipeline** (`src/build.js`):
1. Wipes and recreates `dist/`
2. Writes an inline `style.css` to `dist/`
3. Reads every `.md` file from `src/recipes/`, parses frontmatter with `gray-matter`, renders body with `markdown-it`
4. Writes one `<slug>.html` per recipe to `dist/`
5. Writes `dist/index.html` listing all recipes alphabetically

**Recipe files** (`src/recipes/*.md`):
- YAML frontmatter fields: `title` (required), `date`, `slug` (optional, derived from title if absent), `category` (required — see below)
- Valid categories: `main`, `side`, `sauce`, `seasoning`, `template`
- Files with `category: template` are skipped and never rendered; all other categories produce an HTML file
- `src/recipes/template.md` uses `category: template` and serves as the starting point for new recipes
- Conventional sections: `## Equipment`, `## Ingredients`, `## Instructions`

**Deployment** (`.github/workflows/deploy.yml`):
- Triggers on push to `main` or `master`
- Runs `npm install && npm run build`, then syncs `dist/` to S3 with `--delete`
- Requires GitHub secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`
