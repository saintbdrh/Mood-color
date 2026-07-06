import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { amount, documentId } = await request.json();

    const response = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: amount.toString(),
          },
          custom_id: documentId,
        }],
      }),
    });

    const order = await response.json();
    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 });
  }
}
