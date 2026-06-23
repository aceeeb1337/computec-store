import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateProduct, deleteProduct } from "@/lib/products-store";

export const dynamic = "force-dynamic";

function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/manager-pos");
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  let body: Record<string, unknown> | null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const product = await updateProduct(params.id, body || {});
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateStorefront();
  revalidatePath(`/product/${params.id}`);
  return NextResponse.json({ product });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const ok = await deleteProduct(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateStorefront();
  return NextResponse.json({ ok: true });
}
