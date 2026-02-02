import siteConfig from "@/site.config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-6 md:px-16 lg:px-24 py-8 mt-16 border-t border-[var(--border)]
                       flex flex-col sm:flex-row items-center justify-between gap-2
                       text-xs text-[var(--muted)]">
      <span>
        &copy; {year} {siteConfig.footer.copyright}
      </span>
      <span className="flex items-center gap-1">
        Designed by{" "}
        <a
          href="https://github.com/e5tella"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--foreground)] transition-colors"
        >
          Estella Chen
        </a>
        {siteConfig.footer.showPoweredBy && (
          <>
            {" · Powered by "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--foreground)] transition-colors"
            >
              Next.js
            </a>
          </>
        )}
      </span>
    </footer>
  );
}
