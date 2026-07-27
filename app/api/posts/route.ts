import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeTags, slugify } from "@/lib/markdown";
import { getPublishedPosts } from "@/lib/posts";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const result = await getPublishedPosts({
    query: searchParams.get("q") || "",
    tag: searchParams.get("tag") || "",
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page") || 1)
  });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const status = body.status === "published" ? "published" : "draft";
  const post = await prisma.post.create({
    data: {
      title: String(body.title || "Untitled"),
      slug: slugify(String(body.slug || body.title || "untitled")),
      excerpt: body.excerpt ? String(body.excerpt) : null,
      content: String(body.content || ""),
      coverImage: body.coverImage ? String(body.coverImage) : null,
      coverAlt: body.coverAlt ? String(body.coverAlt) : null,
      tags: serializeTags(body.tags),
      status,
      publishedAt: status === "published" ? new Date() : null
    }
  });
  return NextResponse.json(post, { status: 201 });
}

