import { NextResponse } from "next/server";
import { createOrder, getDocumentById, updateDocument } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { orderId, userEmail, documentId } = await request.json();

    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
      },
    });

    const captureData = await response.json();

    if (captureData.status === "COMPLETED") {
      const doc = await getDocumentById(documentId);
      const order = {
        id: uuidv4(),
        userEmail,
        documentId,
        amount: doc?.price || 0,
        paymentMethod: "paypal" as const,
        status: "completed" as const,
        createdAt: new Date().toISOString(),
        downloadToken: uuidv4(),
      };
      await createOrder(order);

      if (doc) {
        await updateDocument(doc.id, { downloads: doc.downloads + 1 });
      }

      return NextResponse.json({ 
        success: true, 
        downloadToken: order.downloadToken,
        fileUrl: doc?.fileUrl 
      });
    }

    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Capture failed" }, { status: 500 });
  }
}
