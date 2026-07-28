export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarkdownView from "@/components/MarkdownView";
import ReaderControls from "@/components/ReaderControls";
import ShareButtons from "@/components/ShareButtons";
import TableOfContents from "@/components/TableOfContents";
import { headingsFromMarkdown, normalizeTags, readingTime } from "@/lib/markdown";
import { getAllPublishedPostLinks, getPostBySlug } from "@/lib/mongo-store";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: { title: post.title, description: post.excerpt || undefined, images: post.coverImage ? [post.coverImage] : [] }
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();
  const siblings = await getAllPublishedPostLinks();
  const index = siblings.findIndex((item) => item.slug === post.slug);
  const url = `/blogs/${post.slug}`;
  const tags = normalizeTags(post.tags);

  return (
    <article className="min-h-screen bg-coal">
      <header className="relative overflow-hidden border-b border-white/10">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-45 grayscale contrast-125"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(200,16,46,.20),transparent_32rem)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-coal/72 via-coal/82 to-coal" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,#D6A84F_1px,transparent_1px)] [background-size:14px_14px] opacity-10" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 flex flex-wrap justify-center gap-2">
              {tags.map((tag) => <span key={tag} className="rounded border border-poster/45 bg-black/30 px-2 py-1 text-xs text-poster backdrop-blur">{tag}</span>)}
            </div>
            <h1 className="font-display text-5xl uppercase leading-none text-cream md:text-7xl">{post.title}</h1>
            <p className="mt-5 text-sm uppercase text-cream/58">
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()} · {readingTime(post.content)} min read
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="mx-auto max-w-3xl">
          <ReaderControls />
        </div>

        <div className="mt-10 flex items-start gap-10">
          <div className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/36 px-5 py-8 text-[length:var(--reader-size,19px)] text-cream shadow-glow md:px-10 md:py-10">
            <MarkdownView content={post.content} />
            <ShareButtons title={post.title} path={url} />
            <nav className="no-print mt-10 grid gap-3 border-t border-white/10 pt-6 text-sm md:grid-cols-2">
              {siblings[index + 1] ? (
                <a className="rounded border border-white/10 p-4 hover:border-redflag" href={`/blogs/${siblings[index + 1].slug}`}>
                  <span className="text-cream/45">Previous</span><br />
                  <strong className="text-cream">{siblings[index + 1].title}</strong>
                </a>
              ) : <span />}
              {siblings[index - 1] ? (
                <a className="rounded border border-white/10 p-4 text-right hover:border-redflag" href={`/blogs/${siblings[index - 1].slug}`}>
                  <span className="text-cream/45">Next</span><br />
                  <strong className="text-cream">{siblings[index - 1].title}</strong>
                </a>
              ) : null}
            </nav>
          </div>
          <TableOfContents headings={headingsFromMarkdown(post.content)} />
        </div>
      </div>
    </article>
  );
}

