import { NextResponse } from "next/server";
import { getAllDocuments, getAllOrders } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const docs = await getAllDocuments();
  const orders = await getAllOrders();

  const totalRevenue = orders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + o.amount, 0);

  return NextResponse.json({
    totalDocuments: docs.length,
    totalOrders: orders.length,
    totalRevenue,
    totalDownloads: docs.reduce((sum, d) => sum + d.downloads, 0),
  });
}
