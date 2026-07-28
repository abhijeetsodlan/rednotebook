import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import type { PostView as PostListItem } from "@/lib/mongo-store";

export default function PostCard({ post }: { post: PostListItem }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-white/[.035] transition hover:-translate-y-1 hover:border-redflag/70 hover:shadow-glow">
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImage} alt={post.coverAlt || ""} className="h-48 w-full object-cover opacity-85 transition group-hover:opacity-100" />
      ) : (
        <div className="flex h-48 items-center justify-center bg-[radial-gradient(circle,#C8102E_1px,transparent_1px)] [background-size:14px_14px]">
          <span className="font-display text-6xl text-redflag">★</span>
        </div>
      )}
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded border border-poster/35 px-2 py-1 text-xs text-poster">{tag}</span>
          ))}
        </div>
        <Link href={`/blogs/${post.slug}`} className="block font-display text-2xl uppercase leading-tight text-cream group-hover:text-redflag">
          {post.title}
        </Link>
        <p className="line-clamp-3 text-sm leading-6 text-cream/68">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-cream/50">
          <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" />{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{post.readingMinutes} min</span>
        </div>
      </div>
    </article>
  );
}


