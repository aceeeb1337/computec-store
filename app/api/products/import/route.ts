import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { parseCSV, toImageList } from "@/lib/normalize";
import { importFromRows } from "@/lib/products-store";
import type { RawProduct } from "@/lib/catalog-data";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { url?: string; mode?: string } | null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const url = String(body?.url ?? "").trim();
  const mode = body?.mode === "replace" ? "replace" : "merge";
  if (!/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "Provide a valid CSV URL (the published Google Sheet link)." }, { status: 400 });
  }

  let text: string;
  try {
    const res = await fetch(url, { redirect: "follow", cache: "no-store" });
    if (!res.ok) throw new Error();
    text = await res.text();
  } catch {
    return NextResponse.json({ error: "Couldn't fetch the sheet. Make sure it's published to the web as CSV and the link is public." }, { status: 400 });
  }

  const rows = parseCSV(text);
  if (!rows.length) {
    return NextResponse.json({ error: "No rows found. The sheet needs a header row + at least one product row, published as CSV." }, { status: 400 });
  }

  // Fold the `image`/`images` columns into a clean array per row.
  const prepared = rows.map((r) => ({ ...r, images: toImageList(r.images, r.image) })) as unknown as Partial<RawProduct>[];
  const result = await importFromRows(prepared, mode);

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/manager-pos");

  return NextResponse.json(result);
}
