// Extract h2/h3 headings from rendered HTML for the table of contents sidebar.

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const regex = /<h([23])\s+id="([^"]+)"[^>]*>(.*?)<\/h[23]>/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    items.push({
      level: Number(match[1]),
      id: match[2],
      // Strip any inner HTML tags from the heading text.
      text: match[3].replace(/<[^>]+>/g, ""),
    });
  }

  return items;
}
