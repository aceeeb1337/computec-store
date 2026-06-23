import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

// Storage abstraction with two backends:
//  - Production (Vercel/serverless): Upstash Redis, when its env vars are set.
//  - Local development: JSON files under /data (or DATA_DIR).
// This keeps `npm run dev` working with plain files while persisting to a real
// store in the cloud, where the filesystem is read-only/ephemeral.

const DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");

let redis: Redis | null = null;
let redisChecked = false;

function getRedis(): Redis | null {
  if (redisChecked) return redis;
  redisChecked = true;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) redis = new Redis({ url, token });
  return redis;
}

function redisKey(name: string): string {
  return "computec:" + name.replace(/\.json$/, "");
}

/** Reads a stored value, or null if it doesn't exist yet. */
export async function read<T>(name: string): Promise<T | null> {
  const r = getRedis();
  if (r) {
    const v = await r.get<T>(redisKey(name));
    return v ?? null;
  }
  try {
    const raw = await fs.readFile(path.join(DIR, name), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Persists a value (JSON-serialisable). */
export async function write(name: string, data: unknown): Promise<void> {
  const r = getRedis();
  if (r) {
    await r.set(redisKey(name), data);
    return;
  }
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(path.join(DIR, name), JSON.stringify(data, null, 2), "utf8");
}
