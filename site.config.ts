// Site configuration — edit this file to customize your blog.
// All settings are centralized here so you never need to touch the source code.

const siteConfig = {
  // -- Core identity --
  name: "Blog Starter",
  description: "A minimal, open-source blog built with Next.js",
  url: "https://example.com",

  // -- Author --
  author: {
    name: "Your Name",
    email: "",
    github: "https://github.com/yourusername",
    twitter: "",
  },

  // -- Navigation links --
  nav: [
    { label: "Articles", href: "/articles" },
    { label: "Tags", href: "/tags" },
    { label: "About", href: "/about" },
  ],

  // -- Homepage --
  homepage: {
    title: "Blog Starter",
    subtitle: "Thoughts, tutorials, and notes",
    articlesPerPage: 6,
  },

  // -- Article defaults --
  articles: {
    defaultCover: "/images/placeholder-cover.jpg",
  },

  // -- Footer --
  footer: {
    copyright: "Blog Starter",
    showPoweredBy: true,
  },

  // -- SEO --
  locale: "en_US",
  robots: {
    blockAiBots: true,
  },

  // -- Theme --
  theme: {
    defaultMode: "system" as "light" | "dark" | "system",
  },

  // -- Font size accessibility --
  fontSize: {
    min: 14,
    default: 16,
    max: 20,
    step: 2,
  },
};

export default siteConfig;
export type SiteConfig = typeof siteConfig;
