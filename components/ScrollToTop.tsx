"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full
                 bg-[var(--foreground)] text-[var(--background)]
                 flex items-center justify-center text-sm font-mono
                 hover:opacity-80 transition-opacity shadow-lg"
      aria-label="Back to top"
    >
      &uarr;
    </button>
  );
}
