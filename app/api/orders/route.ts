import { NextResponse } from "next/server";
import { createOrder, getUserOrders, Order } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order: Order = {
      id: uuidv4(),
      userEmail: body.userEmail,
      documentId: body.documentId,
      amount: body.amount,
      paymentMethod: body.paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    await createOrder(order);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }
  const orders = await getUserOrders(email);
  return NextResponse.json(orders);
}
