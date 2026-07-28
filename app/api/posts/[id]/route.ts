import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAdminPostById, postPayload, postsCollection, type PostStatus } from "@/lib/mongo-store";
import { toObjectId } from "@/lib/mongodb";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const existing = await getAdminPostById(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const payload = postPayload(body, existing);
  await (await postsCollection()).updateOne({ _id: toObjectId(params.id) }, { $set: payload });
  return NextResponse.json({ ...existing, ...payload, id: params.id });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const existing = await getAdminPostById(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const status: PostStatus = body.status === "published" ? "published" : "draft";
  const payload = { status, updatedAt: new Date(), publishedAt: status === "published" ? existing.publishedAt || new Date() : null };
  await (await postsCollection()).updateOne({ _id: toObjectId(params.id) }, { $set: payload });
  return NextResponse.json({ ...existing, ...payload, id: params.id });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await (await postsCollection()).deleteOne({ _id: toObjectId(params.id) });
  return NextResponse.json({ ok: true });
}
