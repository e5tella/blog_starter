import { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Tags",
  description: "All tags",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight">
        Tags
      </h1>

      <div className="mt-12 flex flex-wrap gap-3">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="group flex items-center gap-2 px-4 py-2 rounded-full
                       border border-[var(--border)] hover:border-[var(--foreground)] transition-colors"
          >
            <span className="font-mono text-sm group-hover:text-[var(--foreground)] transition-colors">
              {tag}
            </span>
            <span className="font-mono text-xs text-[var(--muted)]">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
