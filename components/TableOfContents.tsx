import type { headingsFromMarkdown } from "@/lib/markdown";

export default function TableOfContents({ headings }: { headings: ReturnType<typeof headingsFromMarkdown> }) {
  if (!headings.length) return null;
  return (
    <aside className="no-print sticky top-24 hidden max-h-[70vh] w-64 shrink-0 overflow-auto border-l border-white/10 pl-5 text-sm text-cream/65 lg:block">
      <p className="mb-3 font-display uppercase text-cream">Contents</p>
      <nav className="space-y-2">
        {headings.map((heading) => (
          <a key={heading.id} href={`#${heading.id}`} className={`block hover:text-redflag ${heading.depth === 3 ? "pl-4" : ""}`}>
            {heading.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
