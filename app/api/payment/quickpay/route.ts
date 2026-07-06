import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { amount, documentId, userEmail } = await request.json();

    const response = await fetch("https://merchant.qpay.mn/v2/invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.QUICKPAY_API_KEY}`,
      },
      body: JSON.stringify({
        invoice_code: process.env.QUICKPAY_MERCHANT_ID,
        sender_invoice_no: `DOC-${Date.now()}`,
        invoice_receiver_code: userEmail,
        invoice_description: `Document purchase: ${documentId}`,
        amount: amount,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/quickpay/callback`,
      }),
    });

    const data = await response.json();
    return NextResponse.json({ 
      invoiceId: data.invoice_id,
      qrCode: data.qr_text,
      payUrl: data.qpay_short_url 
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create QPay invoice" }, { status: 500 });
  }
}
