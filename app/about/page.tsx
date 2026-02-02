import fs from "fs";
import path from "path";
import { Metadata } from "next";
import { markdownToHtml } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "About",
  description: "About this blog",
};

export default async function AboutPage() {
  const filePath = path.join(process.cwd(), "content", "about.md");
  const raw = fs.readFileSync(filePath, "utf8");
  const htmlContent = await markdownToHtml(raw);

  return (
    <div className="py-16 max-w-[720px] mx-auto">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight">
        About
      </h1>
      <div
        className="prose mt-8"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
