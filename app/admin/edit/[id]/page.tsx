export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import AdminPostForm from "@/components/AdminPostForm";
import { prisma } from "@/lib/db";
import { normalizeTags } from "@/lib/markdown";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) notFound();
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 font-display text-5xl uppercase">Edit Post</h1>
      <AdminPostForm post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        coverAlt: post.coverAlt,
        tags: normalizeTags(post.tags),
        status: post.status
      }} />
    </section>
  );
}

