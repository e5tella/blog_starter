"use client";

import { useState, useEffect, useMemo } from "react";
import ArticleList from "./ArticleList";
import ArticleGrid from "./ArticleGrid";
import type { ArticleItem } from "./ArticleList";

type ViewMode = "list" | "grid";

export default function ArticleViewToggle({
  articles,
  maxGridItems,
}: {
  articles: ArticleItem[];
  maxGridItems?: number;
}) {
  const [view, setView] = useState<ViewMode>("list");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // Restore persisted preference on mount.
  useEffect(() => {
    const stored = localStorage.getItem("blog-view-mode") as ViewMode | null;
    if (stored === "list" || stored === "grid") setView(stored);
  }, []);

  const toggle = (mode: ViewMode) => {
    setView(mode);
    localStorage.setItem("blog-view-mode", mode);
  };

  // Extract unique years from articles, sorted newest first.
  const years = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) {
      const y = a.date.slice(0, 4);
      set.add(y);
    }
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [articles]);

  // Filter articles by selected year.
  const filtered = useMemo(() => {
    if (selectedYear === "all") return articles;
    return articles.filter((a) => a.date.slice(0, 4) === selectedYear);
  }, [articles, selectedYear]);

  return (
    <div>
      {/* Toolbar: view toggle + year filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* View toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggle("list")}
            className={`p-1.5 rounded-md transition-colors ${
              view === "list"
                ? "bg-[var(--hover-bg)] text-[var(--foreground)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
            aria-label="List view"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
          <button
            onClick={() => toggle("grid")}
            className={`p-1.5 rounded-md transition-colors ${
              view === "grid"
                ? "bg-[var(--hover-bg)] text-[var(--foreground)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
            aria-label="Grid view"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>

        {/* Year filter dropdown */}
        <div className="relative inline-flex items-center">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="appearance-none pl-3 pr-7 py-1.5 text-xs font-mono rounded-md border border-[var(--border)]
                       bg-[var(--background)] text-[var(--foreground)]
                       focus:outline-none focus:border-[var(--accent)] cursor-pointer
                       w-full min-w-0"
          >
            <option value="all">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted)] shrink-0"
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Filtered count */}
      {selectedYear !== "all" && (
        <p className="mb-4 text-xs font-mono text-[var(--muted)]">
          {filtered.length} of {articles.length} articles
        </p>
      )}

      {/* Active view */}
      {view === "list" ? (
        <ArticleList articles={filtered} />
      ) : (
        <>
          <ArticleGrid
            articles={maxGridItems ? filtered.slice(0, maxGridItems) : filtered}
          />
          {maxGridItems && filtered.length > maxGridItems && (
            <div className="mt-6 text-center">
              <a
                href="/articles"
                className="inline-flex items-center gap-2 text-sm font-mono text-[var(--muted)]
                           hover:text-[var(--foreground)] transition-colors"
              >
                View all {filtered.length} articles &rarr;
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
