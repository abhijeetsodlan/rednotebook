import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/auth";

const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || record.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  record.count += 1;
  return record.count > 5;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const { username, password } = await request.json();
  const expectedUser = process.env.ADMIN_USERNAME;
  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedUser || !hash) {
    return NextResponse.json({ error: "Admin credentials are not configured." }, { status: 500 });
  }

  const validUser = username === expectedUser;
  const validPassword = typeof password === "string" && (await bcrypt.compare(password, hash));

  if (!validUser || !validPassword) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  setSessionCookie(response, await createSession(username));
  return response;
}
