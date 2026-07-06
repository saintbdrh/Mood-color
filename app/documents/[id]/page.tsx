import Navbar from "@/components/Navbar";
import PaymentButtons from "@/components/PaymentButtons";
import AdBanner from "@/components/AdBanner";
import { getDocumentById } from "@/lib/db";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const doc = await getDocumentById(params.id);

  if (!doc) return notFound();

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-2xl border border-white/10 p-8 flex items-center justify-center">
            <FileText className="w-32 h-32 text-purple-400" />
          </div>

          <div>
            <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
              {doc.category}
            </span>

            <h1 className="text-3xl font-bold text-white mt-4 mb-2">{doc.title}</h1>
            <p className="text-gray-400 mb-6">{doc.description}</p>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">File Size</span>
                <span className="text-white">{doc.fileSize}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Format</span>
                <span className="text-white">{doc.fileName.split(".").pop()?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Downloads</span>
                <span className="text-white">{doc.downloads}</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-white mb-6">${doc.price}</div>

            <PaymentButtons documentId={doc.id} price={doc.price} />
          </div>
        </div>
      </div>

      <AdBanner />
    </div>
  );
}
