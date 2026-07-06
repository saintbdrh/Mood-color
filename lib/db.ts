import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
});

export interface Document {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  downloads: number;
  createdAt: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userEmail: string;
  documentId: string;
  amount: number;
  paymentMethod: "paypal" | "quickpay";
  status: "pending" | "completed" | "failed";
  createdAt: string;
  downloadToken?: string;
}

const DOCS_KEY = "documents";
const ORDERS_KEY = "orders";

export async function getAllDocuments(): Promise<Document[]> {
  const docs = await redis.hgetall(DOCS_KEY);
  if (!docs) return [];
  return Object.values(docs) as Document[];
}

export async function getDocumentById(id: string): Promise<Document | null> {
  const doc = await redis.hget(DOCS_KEY, id);
  return doc as Document | null;
}

export async function createDocument(doc: Document): Promise<void> {
  await redis.hset(DOCS_KEY, { [doc.id]: doc });
}

export async function updateDocument(id: string, updates: Partial<Document>): Promise<void> {
  const doc = await getDocumentById(id);
  if (doc) {
    await redis.hset(DOCS_KEY, { [id]: { ...doc, ...updates } });
  }
}

export async function deleteDocument(id: string): Promise<void> {
  await redis.hdel(DOCS_KEY, id);
}

export async function createOrder(order: Order): Promise<void> {
  await redis.hset(ORDERS_KEY, { [order.id]: order });
}

export async function getOrderById(id: string): Promise<Order | null> {
  return await redis.hget(ORDERS_KEY, id) as Order | null;
}

export async function getUserOrders(userEmail: string): Promise<Order[]> {
  const orders = await redis.hgetall(ORDERS_KEY);
  if (!orders) return [];
  return Object.values(orders).filter((o: any) => o.userEmail === userEmail) as Order[];
}

export async function getAllOrders(): Promise<Order[]> {
  const orders = await redis.hgetall(ORDERS_KEY);
  if (!orders) return [];
  return Object.values(orders) as Order[];
}

export async function getOrderByToken(token: string): Promise<Order | null> {
  const orders = await getAllOrders();
  return orders.find((o: any) => o.downloadToken === token) || null;
}
