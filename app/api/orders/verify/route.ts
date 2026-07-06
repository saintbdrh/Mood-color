import { NextResponse } from "next/server";
import { getOrderById, updateDocument, getDocumentById, createOrder } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();
    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const downloadToken = uuidv4();
    order.status = "completed";
    order.downloadToken = downloadToken;
    await createOrder(order);

    const doc = await getDocumentById(order.documentId);
    if (doc) {
      await updateDocument(doc.id, { downloads: doc.downloads + 1 });
    }

    return NextResponse.json({ 
      success: true, 
      downloadToken,
      fileUrl: doc?.fileUrl 
    });
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
