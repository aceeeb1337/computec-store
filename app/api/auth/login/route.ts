import { NextResponse } from "next/server";
import { adminPassword, sessionSecret, createToken, safeEqual, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { password?: string } | null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const password = String(body?.password ?? "");
  if (!password || !safeEqual(password, adminPassword())) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = await createToken(sessionSecret(), SESSION_MAX_AGE);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
