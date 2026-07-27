"use client";

import Link from "next/link";
import { CalendarDays, Clock, Search } from "lucide-react";
import { useMemo, useState } from "react";
import PostCard from "@/components/PostCard";
import type { PostListItem } from "@/lib/posts";

export default function BlogsArchive({ posts }: { posts: PostListItem[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return posts;
    return posts.filter((post) => {
      const haystack = [post.title, post.excerpt, post.tags.join(" ")].join(" ").toLowerCase();
      return haystack.includes(needle);
    });
  }, [posts, query]);
  const [lead, ...rest] = filtered;

  return (
    <section className="min-h-screen bg-coal">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(200,16,46,.20),transparent_30rem)]">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-[1fr_360px] md:items-end">
            <div>
              <p className="text-sm uppercase text-poster">Archive</p>
              <h1 className="mt-3 font-display text-5xl uppercase leading-none text-cream md:text-7xl">All Writings</h1>
             
            </div>
            <div className="rounded-lg border border-white/10 bg-black/25 p-4 text-sm text-cream/60">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span>Total published</span>
                <strong className="font-display text-3xl text-cream">{posts.length}</strong>
              </div>
              <p className="pt-3">Showing {filtered.length} {query ? `matching "${query}"` : "from the archive"}</p>
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-white/10 bg-black/40 p-3 shadow-glow">
            <label className="flex items-center gap-3 rounded bg-white/[.045] px-4 py-3 text-cream/55 focus-within:ring-1 focus-within:ring-redflag">
              <Search className="h-5 w-5 shrink-0" aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, excerpt, tag, or idea"
                className="w-full bg-transparent text-cream outline-none placeholder:text-cream/35"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {lead ? (
          <Link href={`/blogs/${lead.slug}`} className="group grid overflow-hidden rounded-lg border border-white/10 bg-white/[.035] transition hover:border-redflag/65 md:grid-cols-[.95fr_1.05fr]">
            <div className="relative min-h-72 bg-[radial-gradient(circle,#C8102E_1px,transparent_1px)] [background-size:14px_14px]">
              {lead.coverImage ? (
                <img src={lead.coverImage} alt={lead.coverAlt || ""} className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-95" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-tr from-coal via-coal/25 to-transparent" />
              <span className="absolute left-5 top-5 rounded bg-redflag px-3 py-1 text-xs font-semibold uppercase text-white">Featured</span>
            </div>
            <div className="flex flex-col justify-between p-6 md:p-8">
              <div>
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map((tag) => <span key={tag} className="rounded border border-poster/35 px-2 py-1 text-xs text-poster">{tag}</span>)}
                </div>
                <h2 className="mt-5 font-display text-4xl uppercase leading-tight text-cream transition group-hover:text-redflag md:text-5xl">{lead.title}</h2>
                <p className="mt-5 line-clamp-4 text-base leading-7 text-cream/64">{lead.excerpt}</p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-cream/48">
                <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{new Date(lead.publishedAt || lead.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{lead.readingMinutes} min read</span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="rounded-lg border border-white/10 bg-white/[.035] p-10 text-center">
            <p className="font-display text-3xl uppercase text-cream">No published posts found</p>
            <p className="mt-3 text-cream/55">Try a different search or clear the field.</p>
          </div>
        )}

        {rest.length ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        ) : null}
      </div>
    </section>
  );
}
