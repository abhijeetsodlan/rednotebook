import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getActiveNotice, getLatestNotice, noticeCollection } from "@/lib/mongo-store";

export async function GET() {
  return NextResponse.json(await getActiveNotice());
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const collection = await noticeCollection();
  await collection.updateMany({}, { $set: { active: false, updatedAt: new Date() } });
  const now = new Date();
  const notice = {
    message: String(body.message || ""),
    active: Boolean(body.active),
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    createdAt: now,
    updatedAt: now
  };
  const result = await collection.insertOne(notice);
  return NextResponse.json({ id: result.insertedId.toString(), ...notice }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const collection = await noticeCollection();
  const existing = await getLatestNotice();
  const now = new Date();
  const data = {
    message: String(body.message || ""),
    active: Boolean(body.active),
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    updatedAt: now
  };
  if (existing) {
    await collection.updateOne({ _id: existing._id }, { $set: data });
    return NextResponse.json({ ...existing, ...data });
  }
  const result = await collection.insertOne({ ...data, createdAt: now });
  return NextResponse.json({ id: result.insertedId.toString(), ...data, createdAt: now });
}

export async function DELETE() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await (await noticeCollection()).deleteMany({});
  return NextResponse.json({ ok: true });
}
