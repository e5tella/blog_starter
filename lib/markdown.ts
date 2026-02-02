import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

// Convert ```mermaid code blocks into <pre class="mermaid"> so that the
// client-side mermaid.js CDN script can pick them up. This must run BEFORE
// rehype-pretty-code to prevent Shiki from tokenizing the diagram source.
function rehypeMermaidPre() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (
        node.tagName !== "pre" ||
        !node.children[0] ||
        (node.children[0] as Element).tagName !== "code"
      )
        return;

      const code = node.children[0] as Element;
      const classes = (code.properties?.className as string[]) || [];
      if (!classes.includes("language-mermaid")) return;

      // Extract raw text and rewrite the node as <pre class="mermaid">
      const text = (code.children[0] as { value?: string })?.value || "";
      node.properties = { className: ["mermaid"] };
      node.children = [{ type: "text", value: text }];
    });
  };
}

// Process markdown string into HTML with syntax highlighting and mermaid support.
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeMermaidPre)
    .use(rehypePrettyCode, {
      theme: {
        light: "github-light",
        dark: "github-dark",
      },
    })
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return String(result);
}
