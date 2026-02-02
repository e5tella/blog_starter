"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import siteConfig from "@/site.config";

export default function ReadingBar({ title }: { title: string }) {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 bg-[var(--background)]/80 backdrop-blur-md
                 border-b border-[var(--border)] transition-transform duration-300"
    >
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 h-12">
        {/* Left — nav links (desktop) / hamburger (mobile) */}
        <div className="flex items-center gap-6">
          <button
            className="md:hidden text-sm font-mono"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
          <nav className="hidden md:flex items-center gap-6">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center — blog name (mobile) / article title (desktop) */}
        <span className="font-[family-name:var(--font-heading)] text-sm font-bold truncate max-w-[40vw]">
          <span className="sm:hidden">{siteConfig.name}</span>
          <span className="hidden sm:inline">{title}</span>
        </span>

        {/* Right — site name */}
        <Link
          href="/"
          className="font-[family-name:var(--font-heading)] text-xs font-semibold
                     text-[var(--muted)] hover:text-[var(--foreground)] transition-colors
                     hidden sm:block"
        >
          {siteConfig.name}
        </Link>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[var(--border)] px-6 py-3 flex flex-col gap-2">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
