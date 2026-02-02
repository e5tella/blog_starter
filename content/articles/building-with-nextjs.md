---
title: "Building a Blog with Next.js SSG"
date: "2026-01-20"
description: "How static site generation works under the hood in this blog starter and why it matters for performance."
tags: ["nextjs", "typescript", "tutorial"]
cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop"
---

## Why Static Site Generation?

Static site generation (SSG) pre-renders every page at **build time**. This means your blog loads instantly — no server-side rendering delays, no loading spinners. The HTML is ready before your visitor even arrives.

```typescript
// Next.js generates all article pages at build time.
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}
```

## The Article Pipeline

Every article goes through a pipeline:

1. Read the `.md` file from `content/articles/`
2. Parse frontmatter with `gray-matter`
3. Convert markdown to HTML with `unified` + `remark` + `rehype`
4. Apply syntax highlighting with Shiki
5. Extract headings for the table of contents
6. Render the page with React

```typescript
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeMermaidPre) // custom plugin for mermaid
    .use(rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark" } })
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return String(result);
}
```

## File-Based Routing

Next.js App Router uses the filesystem for routing:

| File | Route |
|------|-------|
| `app/page.tsx` | `/` |
| `app/articles/page.tsx` | `/articles` |
| `app/articles/[slug]/page.tsx` | `/articles/my-post` |
| `app/tags/[tag]/page.tsx` | `/tags/nextjs` |

> No configuration files. No route definitions. Just files and folders.

## Performance Benefits

Since every page is pre-rendered HTML:

- **Time to First Byte (TTFB)**: Near-instant from CDN
- **No JavaScript required**: Content is visible without JS
- **SEO friendly**: Crawlers see fully rendered HTML
- **Cacheable**: Every page can be cached indefinitely at the edge

This is the ideal architecture for a blog — content rarely changes, and when it does, you simply rebuild and redeploy.
