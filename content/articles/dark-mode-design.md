---
title: "Implementing Dark Mode the Right Way"
date: "2026-01-25"
description: "A deep dive into the dark mode system: CSS custom properties, next-themes, and dual Shiki syntax themes."
tags: ["design", "css", "tutorial"]
cover: "https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&h=450&fit=crop"
---

## The Architecture

Dark mode in this blog uses three layers working together:

1. **CSS custom properties** — define colors for both themes
2. **next-themes** — manages the toggle state and persistence
3. **Shiki dual themes** — syntax highlighting for both modes

## CSS Custom Properties

All colors are defined as CSS variables. The `.dark` class on `<html>` switches the entire palette:

```css
:root {
  --background: #fafafa;
  --foreground: #171717;
  --muted: #737373;
  --accent: #3b82f6;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
  --muted: #a3a3a3;
  --accent: #60a5fa;
}
```

Every component uses `var(--foreground)` instead of hardcoded colors. Change the variables, and the entire site updates.

## next-themes Integration

The `ThemeProvider` wraps the app and handles:

- **Toggle state** between light, dark, and system
- **localStorage persistence** — remembers your choice
- **System preference** — respects `prefers-color-scheme` by default
- **No flash** — the `class` strategy prevents FOUC

```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

## Dual Syntax Themes

Code blocks need special treatment. Shiki renders syntax highlighting at build time, so we need both themes pre-rendered:

```typescript
.use(rehypePrettyCode, {
  theme: {
    light: "github-light",
    dark: "github-dark",
  },
})
```

This outputs two `<pre>` blocks per code snippet — one for each theme. CSS hides the inactive one:

```css
.dark pre[data-theme="light"],
html:not(.dark) pre[data-theme="dark"] {
  display: none !important;
}
```

> This approach means zero JavaScript is needed for code theme switching — it is pure CSS.

## Color Comparison

| Element | Light | Dark |
|---------|-------|------|
| Background | `#fafafa` | `#0a0a0a` |
| Text | `#171717` | `#ededed` |
| Muted | `#737373` | `#a3a3a3` |
| Border | `#e5e5e5` | `#262626` |
| Accent | `#3b82f6` | `#60a5fa` |

The dark palette uses slightly desaturated versions of the light colors to reduce eye strain while maintaining readability.
