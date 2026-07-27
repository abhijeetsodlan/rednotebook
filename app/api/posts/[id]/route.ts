import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { serializeTags, slugify } from "@/lib/markdown";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const existing = await prisma.post.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const status = body.status === "published" ? "published" : "draft";
  const post = await prisma.post.update({
    where: { id: params.id },
    data: {
      title: String(body.title || existing.title),
      slug: slugify(String(body.slug || existing.slug)),
      excerpt: body.excerpt ? String(body.excerpt) : null,
      content: String(body.content || ""),
      coverImage: body.coverImage ? String(body.coverImage) : null,
      coverAlt: body.coverAlt ? String(body.coverAlt) : null,
      tags: serializeTags(body.tags),
      status,
      publishedAt: status === "published" ? existing.publishedAt || new Date() : null
    }
  });
  return NextResponse.json(post);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const status = body.status === "published" ? "published" : "draft";
  const existing = await prisma.post.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const post = await prisma.post.update({
    where: { id: params.id },
    data: {
      status,
      publishedAt: status === "published" ? existing.publishedAt || new Date() : null
    }
  });
  return NextResponse.json(post);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

