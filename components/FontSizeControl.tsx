"use client";

import { useState, useEffect } from "react";
import siteConfig from "@/site.config";

const { min, max, step, default: defaultSize } = siteConfig.fontSize;

export default function FontSizeControl() {
  const [size, setSize] = useState(defaultSize);

  // Read persisted font size on mount.
  useEffect(() => {
    const stored = localStorage.getItem("blog-font-size");
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (parsed >= min && parsed <= max) setSize(parsed);
    }
  }, []);

  // Apply to <html> and persist whenever size changes.
  useEffect(() => {
    document.documentElement.style.fontSize = `${size}px`;
    localStorage.setItem("blog-font-size", String(size));
  }, [size]);

  const decrease = () => setSize((s) => Math.max(min, s - step));
  const increase = () => setSize((s) => Math.min(max, s + step));

  return (
    <div className="flex items-center gap-0.5 font-mono text-xs text-[var(--muted)]">
      <button
        onClick={decrease}
        disabled={size <= min}
        className="w-7 h-7 flex items-center justify-center rounded-md
                   hover:bg-[var(--hover-bg)] disabled:opacity-30 transition-colors"
        aria-label="Decrease font size"
      >
        A-
      </button>
      <button
        onClick={increase}
        disabled={size >= max}
        className="w-7 h-7 flex items-center justify-center rounded-md
                   hover:bg-[var(--hover-bg)] disabled:opacity-30 transition-colors"
        aria-label="Increase font size"
      >
        A+
      </button>
    </div>
  );
}
