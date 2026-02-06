# Static Recipe Site

A tiny static site generator that converts recipe markdown files into HTML and deploys to S3 via GitHub Actions.

## Local build

```bash
npm install
npm run build
```

Open `dist/index.html` in a browser.

## Writing recipes

Add markdown files in `src/recipes`. Optional front matter:

```yaml
---
title: My Recipe
date: 2024-06-15
slug: my-recipe
---
```

## Deploy to S3 (GitHub Actions)

1. Create an S3 bucket and enable static website hosting.
2. Add these repository secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET`

3. Push to `main`. The workflow will build and sync `dist` to your bucket.

## Structure

- `src/recipes` markdown source
- `src/build.js` generator
- `dist` build output
