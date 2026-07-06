import { NextResponse } from "next/server";
import { getOrderByToken, getDocumentById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const order = await getOrderByToken(token);

    if (!order || order.status !== "completed") {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
    }

    const doc = await getDocumentById(order.documentId);

    return NextResponse.json({ 
      success: true, 
      fileUrl: doc?.fileUrl,
      fileName: doc?.fileName 
    });
  } catch (error) {
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
