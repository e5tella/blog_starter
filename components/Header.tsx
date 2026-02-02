import Link from "next/link";
import siteConfig from "@/site.config";
import ThemeToggle from "./ThemeToggle";
import FontSizeControl from "./FontSizeControl";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 md:px-16 lg:px-24 py-5 border-b border-[var(--border)]">
      {/* Left — navigation */}
      <nav className="flex items-center gap-6">
        {siteConfig.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right — controls + site name */}
      <div className="flex items-center gap-3">
        <FontSizeControl />
        <ThemeToggle />
        <Link
          href="/"
          className="font-[family-name:var(--font-heading)] text-sm font-semibold tracking-tight
                     hidden sm:block"
        >
          {siteConfig.name}
        </Link>
      </div>
    </header>
  );
}
