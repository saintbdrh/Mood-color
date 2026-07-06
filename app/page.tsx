import Navbar from "@/components/Navbar";
import DocumentCard from "@/components/DocumentCard";
import AdBanner from "@/components/AdBanner";
import { getAllDocuments } from "@/lib/db";

export default async function Home() {
  const documents = await getAllDocuments();

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="bg-gradient-to-b from-purple-900/20 to-gray-950 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Professional Document Templates
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Official forms, certificates, and themes ready to download
        </p>
      </div>

      <AdBanner />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>

        {documents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No documents available yet. Check back soon!</p>
          </div>
        )}
      </div>

      <AdBanner />
    </div>
  );
}
