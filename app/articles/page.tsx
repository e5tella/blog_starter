import { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import ArticleViewToggle from "@/components/ArticleViewToggle";

export const metadata: Metadata = {
  title: "Articles",
  description: "All articles",
};

export default function ArticlesPage() {
  const articles = getAllArticles().map((a) => ({
    slug: a.slug,
    title: a.title,
    date: a.date.replace(/-/g, "."),
    description: a.description,
    tags: a.tags,
    cover: a.cover,
    readingTime: a.readingTime,
  }));

  return (
    <div className="py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight">
        Articles
      </h1>

      <div className="mt-12">
        <ArticleViewToggle articles={articles} />
      </div>
    </div>
  );
}
