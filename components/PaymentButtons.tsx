"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function PaymentButtons({ documentId, price }: { documentId: string; price: number }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <p className="text-gray-400 text-sm">Please sign in to purchase</p>
    );
  }

  const handlePayPal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price, documentId }),
      });
      const data = await res.json();

      if (data.orderId) {
        // Redirect to PayPal for approval
        window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${data.orderId}`;
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleQPay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/quickpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price,
          documentId,
          userEmail: session.user?.email,
        }),
      });
      const data = await res.json();

      if (data.payUrl) {
        window.open(data.payUrl, "_blank");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handlePayPal}
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold transition-colors disabled:opacity-50"
      >
        Pay with PayPal (${price})
      </button>

      <button
        onClick={handleQPay}
        disabled={loading}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold transition-colors disabled:opacity-50"
      >
        Pay with QPay (Mongolia)
      </button>
    </div>
  );
}
