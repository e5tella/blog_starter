---
title: "Deploying Your Blog to Vercel"
date: "2026-01-18"
description: "A step-by-step guide to deploying your blog starter to Vercel with automatic CI/CD on every push."
tags: ["devops", "tutorial"]
cover: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop"
---

## Prerequisites

Before deploying, make sure you have:

- A [GitHub](https://github.com) account with your blog repository
- A [Vercel](https://vercel.com) account (free tier works fine)
- Your `site.config.ts` updated with your production URL

## Step 1: Push to GitHub

If you haven't already, initialize a git repository and push:

```bash
git init
git add -A
git commit -m "Initial commit"
git remote add origin https://github.com/you/your-blog.git
git push -u origin main
```

## Step 2: Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Next.js — no configuration needed
4. Click **Deploy**

That's it. Vercel will:

- Install dependencies
- Run `npm run build`
- Deploy to a global CDN
- Give you a `.vercel.app` URL

## Step 3: Custom Domain

To use your own domain:

1. Go to your project settings on Vercel
2. Navigate to **Domains**
3. Add your domain (e.g., `blog.example.com`)
4. Update your DNS records as instructed

> **Important:** Update the `url` field in `site.config.ts` to match your production domain. This affects sitemap URLs, Open Graph tags, and canonical links.

## Automatic Deployments

Every time you push to `main`, Vercel automatically rebuilds and deploys your site. The workflow looks like this:

1. Write a new article in `content/articles/`
2. Commit and push to GitHub
3. Vercel detects the push
4. Builds the site (~10 seconds)
5. Deploys to the CDN globally

No CI/CD configuration required.

## Alternative Platforms

While Vercel is the recommended platform for Next.js, you can also deploy to:

- **Netlify** — similar Git-based deployment
- **Cloudflare Pages** — excellent performance, free tier
- **Self-hosted** — run `npm run build && npm start` on any Node.js server

For static hosting (GitHub Pages, S3), add `output: "export"` to `next.config.ts`.

## Environment Variables

This blog starter does not require any environment variables. All configuration lives in `site.config.ts` and is baked into the build. Keep it simple.
