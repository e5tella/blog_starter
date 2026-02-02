import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getArticleBySlug, getAllSlugs, getAllArticles } from "@/lib/articles";
import siteConfig from "@/site.config";
import { markdownToHtml } from "@/lib/markdown";
import { extractToc } from "@/lib/toc";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import TableOfContents from "@/components/TableOfContents";
import MermaidZoom from "@/components/MermaidZoom";
import ReadingBar from "@/components/ReadingBar";
import ScrollToTop from "@/components/ScrollToTop";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const title = article.title;
  const description = article.description || SITE_NAME;
  const url = `${SITE_URL}/articles/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: article.date,
      tags: article.tags,
    },
    twitter: {
      card: "summary",
      title: `${title} — ${SITE_NAME}`,
      description,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const htmlContent = await markdownToHtml(article.content);
  const tocItems = extractToc(htmlContent);
  const formattedDate = article.date.replace(/-/g, ".");

  // Compute article index and prev/next navigation.
  const allArticles = getAllArticles();
  const currentIndex = allArticles.findIndex((a) => a.slug === slug);
  const articleNum = String(currentIndex + 1).padStart(2, "0");
  const prevArticle =
    currentIndex < allArticles.length - 1
      ? allArticles[currentIndex + 1]
      : null;
  const nextArticle =
    currentIndex > 0 ? allArticles[currentIndex - 1] : null;

  return (
    <div className="relative py-16">
      <ReadingBar title={article.title} />
      <MermaidZoom />
      <ScrollToTop />

      <div className="relative max-w-[720px] mx-auto">
        {/* TOC sidebar — left of article on xl screens */}
        <aside className="hidden xl:block absolute right-full top-0 bottom-0 mr-10 w-48">
          <TableOfContents items={tocItems} />
        </aside>

        <article>
          {/* Back link */}
          <Link
            href="/articles"
            className="text-sm font-mono text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            &larr; Back
          </Link>

          {/* Number + date */}
          <div className="mt-10 mb-4 flex items-baseline gap-4 font-mono text-sm text-[var(--muted)]">
            <span>[{articleNum}]</span>
            <span>{formattedDate}</span>
            <span>{article.readingTime} min read</span>
          </div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-heading)] font-bold leading-[1.15] tracking-[-0.022em] text-[clamp(2.125rem,1.36vw+1.78rem,2.875rem)]">
            {article.title}
          </h1>

          {/* Description */}
          {article.description && (
            <p className="mt-4 text-[var(--muted)] text-base leading-relaxed">
              {article.description}
            </p>
          )}

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="px-2.5 py-0.5 text-xs font-mono rounded-full
                             border border-[var(--border)] text-[var(--muted)]
                             hover:text-[var(--foreground)] hover:border-[var(--foreground)]
                             transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Cover image */}
          {article.showCover && article.cover && (
            <div className="mt-8 -mx-4 sm:mx-0 aspect-[2/1] relative rounded-lg overflow-hidden">
              <Image
                src={article.cover}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 720px) 100vw, 720px"
                priority
              />
            </div>
          )}

          <hr className="border-[var(--border)] mt-8 mb-10" />

          {/* Article content */}
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Prev / Next navigation */}
          {(prevArticle || nextArticle) && (
            <nav className="flex justify-between pt-8 mt-16 border-t border-[var(--border)] text-sm font-mono">
              {prevArticle ? (
                <Link
                  href={`/articles/${prevArticle.slug}`}
                  className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  &larr; {prevArticle.title}
                </Link>
              ) : (
                <span />
              )}
              {nextArticle ? (
                <Link
                  href={`/articles/${nextArticle.slug}`}
                  className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-right"
                >
                  {nextArticle.title} &rarr;
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </article>
      </div>
    </div>
  );
}
