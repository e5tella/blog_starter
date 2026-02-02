import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getAllTags, getArticlesByTag } from "@/lib/articles";
import ArticleViewToggle from "@/components/ArticleViewToggle";

export async function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: decoded,
    description: `Articles tagged "${decoded}"`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const articles = getArticlesByTag(decoded);
  if (articles.length === 0) notFound();

  return (
    <div className="py-16">
      <Link
        href="/tags"
        className="text-sm font-mono text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        &larr; All Tags
      </Link>

      <div className="mt-10 flex items-baseline gap-4">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight">
          {decoded}
        </h1>
        <span className="font-mono text-sm text-[var(--muted)]">
          {articles.length} {articles.length === 1 ? "article" : "articles"}
        </span>
      </div>

      <div className="mt-12">
        <ArticleViewToggle
          articles={articles.map((a) => ({
            slug: a.slug,
            title: a.title,
            date: a.date.replace(/-/g, "."),
            description: a.description,
            tags: a.tags,
            cover: a.cover,
            readingTime: a.readingTime,
          }))}
          maxGridItems={6}
        />
      </div>
    </div>
  );
}
