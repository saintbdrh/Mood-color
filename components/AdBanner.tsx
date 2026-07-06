"use client";

import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && "adsbygoogle" in window) {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
      }
    } catch {}
  }, []);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId) return null;

  return (
    <div className="w-full flex justify-center py-3">
      <ins
        className="adsbygoogle"
        style={{ display: "block", maxWidth: "728px", width: "100%", height: "90px" }}
        data-ad-client={clientId}
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
