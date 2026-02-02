import Link from "next/link";
import siteConfig from "@/site.config";
import { getLatestArticles } from "@/lib/articles";
import ArticleViewToggle from "@/components/ArticleViewToggle";

export default function Home() {
  const articles = getLatestArticles(siteConfig.homepage.articlesPerPage).map(
    (a) => ({
      slug: a.slug,
      title: a.title,
      date: a.date.replace(/-/g, "."),
      description: a.description,
      tags: a.tags,
      cover: a.cover,
      readingTime: a.readingTime,
    }),
  );

  return (
    <div className="py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight">
        {siteConfig.homepage.title}
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        {siteConfig.homepage.subtitle}
      </p>

      {/* Section divider */}
      <div className="mt-16 mb-8 flex items-center gap-4">
        <span className="font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
          Latest
        </span>
        <span className="flex-1 border-t border-[var(--border)]" />
      </div>

      <section>
        <ArticleViewToggle articles={articles} maxGridItems={6} />
      </section>

      <div className="mt-10">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm hover:text-[var(--muted)] transition-colors"
        >
          &rarr; All Articles
        </Link>
      </div>
    </div>
  );
}
