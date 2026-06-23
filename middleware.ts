import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, sessionSecret, verifyToken } from "@/lib/auth";

/** Paths that must stay reachable without an admin session. */
function isPublic(pathname: string, method: string): boolean {
  if (pathname === "/manager-pos/login") return true;
  if (pathname === "/api/orders" && method === "POST") return true; // public checkout
  if (pathname === "/api/site-settings" && method === "GET") return true; // public hero read
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname, req.method)) return NextResponse.next();

  const ok = await verifyToken(sessionSecret(), req.cookies.get(SESSION_COOKIE)?.value);
  if (ok) return NextResponse.next();

  // Unauthenticated:
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/manager-pos/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/manager-pos",
    "/manager-pos/:path*",
    "/api/products",
    "/api/products/:path*",
    "/api/orders",
    "/api/orders/:path*",
    "/api/site-settings",
    "/api/site-settings/:path*",
  ],
};
