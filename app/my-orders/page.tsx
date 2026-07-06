import Navbar from "@/components/Navbar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserOrders, getDocumentById } from "@/lib/db";

export default async function MyOrdersPage() {
  const session = await getSession();

  if (!session?.user?.email) {
    redirect("/");
  }

  const orders = await getUserOrders(session.user.email);

  const ordersWithDocs = await Promise.all(
    orders.map(async (order) => {
      const doc = await getDocumentById(order.documentId);
      return { ...order, document: doc };
    })
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

        {ordersWithDocs.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {ordersWithDocs.map((order) => (
              <div key={order.id} className="bg-gray-900 rounded-xl border border-white/10 p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-semibold">{order.document?.title || "Unknown"}</h3>
                  <p className="text-gray-500 text-sm">${order.amount} · {order.paymentMethod}</p>
                  <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                {order.status === "completed" && order.downloadToken && (
                  <a
                    href={`/api/download?token=${order.downloadToken}`}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm"
                  >
                    Download
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
