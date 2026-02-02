import Link from "next/link";
import Image from "next/image";
import siteConfig from "@/site.config";

export interface ArticleItem {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  cover?: string;
  readingTime?: number;
}

export default function ArticleList({
  articles,
}: {
  articles: ArticleItem[];
}) {
  return (
    <div>
      {articles.map((article, i) => {
        const num = String(i + 1).padStart(2, "0");
        return (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="group relative flex flex-col sm:flex-row items-start gap-2 sm:gap-6
                       py-5 border-b border-dashed border-[var(--border)]"
          >
            {/* Sliding background on hover */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[var(--hover-bg)] origin-left
                         scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            />

            {/* Left — number + date */}
            <div className="relative flex sm:flex-col items-baseline sm:items-start gap-3
                            min-w-[13vw] font-mono text-sm text-[var(--muted)]">
              <span>[{num}]</span>
              <span>{article.date}</span>
            </div>

            {/* Right — title + tags + reading time */}
            <div className="relative flex-1 min-w-0">
              <h3
                className="font-[family-name:var(--font-heading)] font-bold tracking-tight
                           text-[max(18px,1.6vw)] leading-tight"
              >
                {article.title}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {article.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[0.65rem] font-mono rounded-full
                               border border-[var(--border)] text-[var(--muted)]"
                  >
                    {tag}
                  </span>
                ))}
                {article.readingTime && (
                  <span className="text-xs text-[var(--muted)] font-mono">
                    {article.readingTime} min read
                  </span>
                )}
              </div>
            </div>

            {/* Cover thumbnail */}
            {(article.cover || siteConfig.articles.defaultCover) && (
              <div className="relative hidden sm:block flex-shrink-0 w-24 h-16 rounded overflow-hidden
                              bg-[var(--hover-bg)]">
                <Image
                  src={article.cover || siteConfig.articles.defaultCover}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="96px"
                />
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
