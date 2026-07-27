import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getActiveNotice } from "@/lib/posts";

export async function GET() {
  return NextResponse.json(await getActiveNotice());
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  await prisma.notice.updateMany({ data: { active: false } });
  const notice = await prisma.notice.create({
    data: {
      message: String(body.message || ""),
      active: Boolean(body.active),
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null
    }
  });
  return NextResponse.json(notice, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const existing = await prisma.notice.findFirst({ orderBy: { updatedAt: "desc" } });
  const data = {
    message: String(body.message || ""),
    active: Boolean(body.active),
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : null
  };
  const notice = existing
    ? await prisma.notice.update({ where: { id: existing.id }, data })
    : await prisma.notice.create({ data });
  return NextResponse.json(notice);
}

export async function DELETE() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.notice.deleteMany();
  return NextResponse.json({ ok: true });
}
