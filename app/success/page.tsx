"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Download } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(`/api/download?token=${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setFileUrl(data.fileUrl);
            setFileName(data.fileName);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading your download...</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-400" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
      <p className="text-gray-400 mb-6">Your document is ready for download.</p>

      {fileUrl && (
        <a
          href={fileUrl}
          download={fileName}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-white font-semibold"
        >
          <Download className="w-4 h-4" />
          Download Now
        </a>
      )}

      <div className="mt-6">
        <Link href="/" className="text-gray-500 hover:text-white text-sm">
          Back to store
        </Link>
      </div>
    </>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
