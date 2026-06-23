import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getOrders, createOrder, type NewOrderInput } from "@/lib/orders-store";
import type { PaymentMethod } from "@/lib/types";

export const dynamic = "force-dynamic";

const METHODS: PaymentMethod[] = ["jazzcash", "easypaisa", "card", "cod"];

export async function GET() {
  return NextResponse.json({ orders: await getOrders() });
}

export async function POST(req: Request) {
  let body: Partial<NewOrderInput> | null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const items = Array.isArray(body?.items) ? body!.items : [];
  if (!body?.name?.trim() || !body?.phone?.trim() || !body?.city?.trim()) {
    return NextResponse.json({ error: "Missing customer details" }, { status: 400 });
  }
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const input: NewOrderInput = {
    name: String(body.name).slice(0, 120),
    phone: String(body.phone).slice(0, 40),
    email: body.email ? String(body.email).slice(0, 160) : "",
    address: body.address ? String(body.address).slice(0, 240) : "",
    city: String(body.city).slice(0, 60),
    notes: body.notes ? String(body.notes).slice(0, 240) : "",
    method: METHODS.includes(body.method as PaymentMethod) ? (body.method as PaymentMethod) : "cod",
    items: items.map((i) => ({ id: String(i.id), qty: Math.max(1, Math.round(Number(i.qty) || 1)) })),
  };

  const order = await createOrder(input);

  // Stock + storefront changed.
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/manager-pos");

  return NextResponse.json({ order }, { status: 201 });
}
