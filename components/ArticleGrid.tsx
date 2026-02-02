import Link from "next/link";
import Image from "next/image";
import siteConfig from "@/site.config";
import type { ArticleItem } from "./ArticleList";

export default function ArticleGrid({
  articles,
}: {
  articles: ArticleItem[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, i) => (
        <Link
          key={article.slug}
          href={`/articles/${article.slug}`}
          className="group"
        >
          <article
            className="border border-[var(--border)] rounded-lg overflow-hidden
                       hover:border-[var(--foreground)] transition-colors"
          >
            {/* Cover image */}
            <div className="aspect-[16/9] relative bg-[var(--hover-bg)] overflow-hidden">
              <Image
                src={article.cover || siteConfig.articles.defaultCover}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Article number overlay */}
              <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-mono
                               bg-black/60 text-white rounded backdrop-blur-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Card body */}
            <div className="p-4">
              <div className="flex items-center gap-3 text-xs font-mono text-[var(--muted)]">
                <time>{article.date}</time>
                {article.readingTime && (
                  <span>{article.readingTime} min read</span>
                )}
              </div>
              <h3
                className="mt-1.5 font-[family-name:var(--font-heading)] font-bold
                           leading-tight tracking-tight text-lg
                           group-hover:text-[var(--accent)] transition-colors"
              >
                {article.title}
              </h3>
              {article.description && (
                <p className="mt-2 text-sm text-[var(--muted)] line-clamp-2">
                  {article.description}
                </p>
              )}

              {/* Tags (max 3 in grid view) */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[0.65rem] font-mono rounded-full
                                 border border-[var(--border)] text-[var(--muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
