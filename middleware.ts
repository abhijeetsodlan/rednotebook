import { NextRequest, NextResponse } from "next/server";
import { isAuthedRequest } from "@/lib/auth";

const protectedMutation = ["/api/posts", "/api/notice"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isMutation =
    protectedMutation.some((path) => pathname.startsWith(path)) &&
    !["GET", "HEAD", "OPTIONS"].includes(request.method);

  if (!isAdminPage && !isMutation) return NextResponse.next();

  const authed = await isAuthedRequest(request);
  if (authed) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = new URL("/admin/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/api/posts/:path*", "/api/notice/:path*"]
};
