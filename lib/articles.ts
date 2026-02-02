import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Article metadata parsed from frontmatter.
export interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  cover?: string;
  showCover: boolean; // whether to display cover on article page
  readingTime: number; // computed, in minutes
}

// Full article including raw markdown content.
export interface ArticleFull extends ArticleMeta {
  content: string;
}

const articlesDir = path.join(process.cwd(), "content", "articles");

// Estimate reading time from word count (~200 wpm).
function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// Return all articles sorted by date (newest first).
export function getAllArticles(): ArticleMeta[] {
  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));

  const articles: ArticleMeta[] = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(articlesDir, filename), "utf8");
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title || slug,
      date: data.date || "1970-01-01",
      description: data.description || "",
      tags: data.tags || [],
      cover: data.cover || undefined,
      showCover: data.showCover !== false, // defaults to true
      readingTime: estimateReadingTime(content),
    };
  });

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

// Return a single article by slug, including raw markdown content.
export function getArticleBySlug(slug: string): ArticleFull | null {
  const filePath = path.join(articlesDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || slug,
    date: data.date || "1970-01-01",
    description: data.description || "",
    tags: data.tags || [],
    cover: data.cover || undefined,
    showCover: data.showCover !== false, // defaults to true
    readingTime: estimateReadingTime(content),
    content,
  };
}

// Return all slugs for static path generation.
export function getAllSlugs(): string[] {
  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

// Return all unique tags with their article counts, sorted by count descending.
export function getAllTags(): { tag: string; count: number }[] {
  const articles = getAllArticles();
  const map = new Map<string, number>();

  for (const a of articles) {
    for (const t of a.tags) {
      map.set(t, (map.get(t) || 0) + 1);
    }
  }

  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

// Return articles matching a given tag (case-insensitive).
export function getArticlesByTag(tag: string): ArticleMeta[] {
  const lower = tag.toLowerCase();
  return getAllArticles().filter((a) =>
    a.tags.some((t) => t.toLowerCase() === lower),
  );
}

// Return the N most recent articles.
export function getLatestArticles(count: number): ArticleMeta[] {
  return getAllArticles().slice(0, count);
}
