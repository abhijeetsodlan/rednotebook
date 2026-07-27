import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-coal/88 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl uppercase tracking-normal text-cream">
          <img
            src="/che-cigar.jpg"
            alt=""
            aria-hidden="true"
            className="h-5 w-5 rounded-full object-cover object-top ring-1 ring-redflag/60"
          />
          Red Notebook
        </Link>
        <div className="flex items-center gap-5 text-sm text-cream/75">
          <Link className="hover:text-redflag" href="/blogs">Blogs</Link>
        </div>
      </div>
    </nav>
  );
}
