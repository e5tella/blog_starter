"use client";

import { useEffect, useState, useRef } from "react";

// Declare mermaid on window for CDN-loaded script.
interface MermaidAPI {
  initialize: (config: object) => void;
  run: (opts: { nodes: NodeListOf<Element> }) => Promise<void>;
}

export default function MermaidZoom() {
  const [svgHtml, setSvgHtml] = useState<string | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [ready, setReady] = useState(false);
  const [rendered, setRendered] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const dragOrigin = useRef({ x: 0, y: 0 });
  const transformRef = useRef(transform);
  transformRef.current = transform;

  // Store original diagram sources for re-rendering on theme change.
  const sourcesRef = useRef<Map<Element, string>>(new Map());

  // Determine current mermaid theme based on .dark class.
  const getMermaidTheme = () =>
    document.documentElement.classList.contains("dark") ? "dark" : "default";

  // Render mermaid diagrams via CDN script.
  useEffect(() => {
    const nodes = document.querySelectorAll("pre.mermaid");
    if (nodes.length === 0) return;

    // Store original source before mermaid replaces it.
    nodes.forEach((node) => {
      sourcesRef.current.set(node, node.textContent || "");
    });

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    script.onload = () => {
      const mermaid = (window as unknown as { mermaid: MermaidAPI }).mermaid;
      mermaid.initialize({ startOnLoad: false, theme: getMermaidTheme() });
      mermaid.run({ nodes }).then(() => setRendered(true));
    };
    document.head.appendChild(script);

    // Watch for theme changes to re-render with correct colors.
    const observer = new MutationObserver(() => {
      const mermaid = (window as unknown as { mermaid?: MermaidAPI }).mermaid;
      if (!mermaid) return;

      // Restore original <pre class="mermaid"> elements with stored source.
      const currentNodes = document.querySelectorAll(
        '.prose .mermaid-wrapper, .prose pre.mermaid, .prose [data-mermaid-processed]',
      );
      currentNodes.forEach((node) => {
        // Find the original source for this node or its child.
        for (const [origNode, source] of sourcesRef.current.entries()) {
          if (node === origNode || node.contains(origNode) || origNode.contains(node)) {
            const pre = document.createElement("pre");
            pre.className = "mermaid";
            pre.textContent = source;
            node.replaceWith(pre);
            sourcesRef.current.delete(origNode);
            sourcesRef.current.set(pre, source);
            break;
          }
        }
      });

      // Re-render with new theme.
      const freshNodes = document.querySelectorAll("pre.mermaid");
      if (freshNodes.length === 0) return;
      mermaid.initialize({ startOnLoad: false, theme: getMermaidTheme() });
      mermaid.run({ nodes: freshNodes }).then(() => setRendered((r) => !r));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Wrap rendered mermaid SVGs with a container and "Open" hint.
  useEffect(() => {
    const svgs = document.querySelectorAll('.prose svg[id^="mermaid"]');
    svgs.forEach((svg) => {
      if (svg.parentElement?.classList.contains("mermaid-wrapper")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "mermaid-wrapper";
      const hint = document.createElement("span");
      hint.className = "mermaid-open-hint";
      hint.textContent = "Open";
      svg.parentElement?.insertBefore(wrapper, svg);
      wrapper.appendChild(svg);
      wrapper.appendChild(hint);
    });
  }, [rendered]);

  // Click on mermaid SVG to open lightbox viewer.
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const svg = (e.target as Element).closest(
        'svg[id^="mermaid"]',
      ) as SVGSVGElement | null;
      if (!svg) return;
      setSvgHtml(svg.outerHTML);
      setTransform({ x: 0, y: 0, scale: 1 });
      setReady(false);
    };
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, []);

  // Fit SVG to screen when lightbox opens.
  useEffect(() => {
    if (!svgHtml) return;
    requestAnimationFrame(() => {
      const svgEl = overlayRef.current?.querySelector("svg");
      if (!svgEl) return;
      const rect = svgEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const fitScale = Math.min(
        (window.innerWidth * 0.85) / rect.width,
        (window.innerHeight * 0.8) / rect.height,
        4,
      );
      setTransform({ x: 0, y: 0, scale: Math.max(fitScale, 0.5) });
      setReady(true);
    });
  }, [svgHtml]);

  // Wheel zoom (non-passive to allow preventDefault).
  useEffect(() => {
    const el = overlayRef.current;
    if (!el || !svgHtml) return;
    const handle = (e: WheelEvent) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? -0.15 : 0.15;
      setTransform((t) => ({
        ...t,
        scale: Math.max(0.3, Math.min(8, t.scale + dir * t.scale)),
      }));
    };
    el.addEventListener("wheel", handle, { passive: false });
    return () => el.removeEventListener("wheel", handle);
  }, [svgHtml]);

  // ESC to close lightbox.
  useEffect(() => {
    if (!svgHtml) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSvgHtml(null);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [svgHtml]);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    didDrag.current = false;
    dragOrigin.current = {
      x: e.clientX - transformRef.current.x,
      y: e.clientY - transformRef.current.y,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    didDrag.current = true;
    setTransform((t) => ({
      ...t,
      x: e.clientX - dragOrigin.current.x,
      y: e.clientY - dragOrigin.current.y,
    }));
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  if (!svgHtml) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center
                 cursor-grab active:cursor-grabbing select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget && !didDrag.current) setSvgHtml(null);
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <button
        onClick={() => setSvgHtml(null)}
        className="absolute top-6 right-6 text-white/60 hover:text-white text-xl font-mono z-10"
      >
        ✕
      </button>
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs font-mono">
        Scroll to zoom · Drag to pan · ESC to close
      </p>
      <div
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          opacity: ready ? 1 : 0,
          transition: ready ? "none" : "opacity 0.15s",
        }}
        className="[&>svg]:bg-white [&>svg]:rounded-lg [&>svg]:p-4"
        dangerouslySetInnerHTML={{ __html: svgHtml }}
      />
    </div>
  );
}
