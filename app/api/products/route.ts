import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getStoredRaw, createProduct } from "@/lib/products-store";

export const dynamic = "force-dynamic";

function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/manager-pos");
}

export async function GET() {
  return NextResponse.json({ products: await getStoredRaw() });
}

export async function POST(req: Request) {
  let body: Record<string, unknown> | null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const product = await createProduct(body);
  revalidateStorefront();
  return NextResponse.json({ product }, { status: 201 });
}
