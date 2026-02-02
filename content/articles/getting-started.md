---
title: "Getting Started with Blog Starter"
date: "2026-02-01"
description: "A quick guide to setting up your own blog with this minimal Next.js starter template."
tags: ["tutorial", "nextjs"]
cover: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop"
---

## Welcome

This is a minimal, open-source blog starter built with **Next.js**, **Tailwind CSS**, and **Markdown**. It is designed to be simple, fast, and easy to customize.

## Features

- **Static site generation** — all pages are pre-rendered at build time
- **Markdown articles** — write in `.md` files with frontmatter metadata
- **Syntax highlighting** — powered by Shiki with dual light/dark themes
- **Mermaid diagrams** — render flowcharts and diagrams in your posts
- **Dark mode** — toggle between light and dark themes
- **List / Grid view** — switch between article list and card grid on the homepage
- **Font size control** — accessibility controls to increase or decrease text size
- **SEO ready** — Open Graph, Twitter Cards, sitemap, and robots.txt

## Quick Start

1. Fork this repository
2. Run `npm install`
3. Edit `site.config.ts` with your information
4. Add your articles to `content/articles/`
5. Run `npm run dev` to preview locally
6. Deploy to Vercel or your preferred hosting

## Writing Articles

Create a new `.md` file in `content/articles/` with frontmatter:

```yaml
---
title: "My First Post"
date: "2026-01-15"
description: "A short summary for SEO and previews"
tags: ["blog", "tutorial"]
cover: "https://example.com/image.jpg"
---
```

The `cover` field is optional — it provides a preview image for grid view.

> **Tip:** Articles are sorted by date, newest first. Use the `YYYY-MM-DD` format.

## Configuration

Everything you need to customize lives in a single file: `site.config.ts`. Change your site name, description, navigation links, and more — no need to edit any source code.
