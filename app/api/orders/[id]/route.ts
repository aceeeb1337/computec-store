import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateOrderStatus } from "@/lib/orders-store";
import { ORDER_STATUSES } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  let body: { status?: string } | null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const status = body?.status;
  if (!status || !(ORDER_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await updateOrderStatus(params.id, status);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  revalidatePath("/manager-pos");
  return NextResponse.json({ order });
}
