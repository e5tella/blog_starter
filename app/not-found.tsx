import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-32 text-center">
      <h1 className="font-[family-name:var(--font-heading)] text-6xl font-bold">
        404
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-sm font-mono hover:text-[var(--muted)] transition-colors"
      >
        &larr; Back to home
      </Link>
    </div>
  );
}
