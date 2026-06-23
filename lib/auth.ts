// Dependency-free admin auth: a signed (HMAC-SHA256) session token stored in an
// httpOnly cookie. Uses Web Crypto so it works in both the Node route handlers
// and the Edge middleware. No external libraries.

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "computec-admin";
}

export function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "dev-insecure-secret-change-me";
}

const encoder = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(str: string): Uint8Array {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0;
  s += "=".repeat(pad);
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

/** Creates a signed token: base64url(payload).base64url(signature). */
export async function createToken(secret: string, maxAgeSec: number): Promise<string> {
  const payload = b64url(encoder.encode(JSON.stringify({ exp: Date.now() + maxAgeSec * 1000 })));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(payload));
  return `${payload}.${b64url(new Uint8Array(sig))}`;
}

/** Verifies signature + expiry of a session token. */
export async function verifyToken(secret: string, token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  try {
    const valid = await crypto.subtle.verify("HMAC", await hmacKey(secret), fromB64url(sig), encoder.encode(payload));
    if (!valid) return false;
    const { exp } = JSON.parse(new TextDecoder().decode(fromB64url(payload)));
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}

/** Constant-time string comparison for the password check. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
