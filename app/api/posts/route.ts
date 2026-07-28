import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getPublishedPosts, postPayload, postsCollection } from "@/lib/mongo-store";

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
  const now = new Date();
  const payload = { ...postPayload(body), createdAt: now };
  const result = await (await postsCollection()).insertOne(payload as never);
  return NextResponse.json({ id: result.insertedId.toString(), ...payload }, { status: 201 });
}
