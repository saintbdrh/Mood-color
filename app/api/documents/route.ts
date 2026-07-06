import { NextResponse } from "next/server";
import { getAllDocuments, createDocument, Document } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function GET() {
  const docs = await getAllDocuments();
  return NextResponse.json(docs);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const doc: Document = {
      id: uuidv4(),
      title: body.title,
      description: body.description,
      price: parseFloat(body.price),
      category: body.category,
      fileUrl: body.fileUrl,
      fileName: body.fileName,
      fileSize: body.fileSize,
      downloads: 0,
      createdAt: new Date().toISOString(),
      imageUrl: body.imageUrl || null,
    };
    await createDocument(doc);
    return NextResponse.json(doc);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
