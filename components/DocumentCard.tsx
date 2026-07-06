"use client";

import { FileText, ShoppingCart } from "lucide-react";
import Link from "next/link";

interface Document {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  fileSize: string;
  downloads: number;
  imageUrl?: string;
}

export default function DocumentCard({ document }: { document: Document }) {
  return (
    <div className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-colors">
      {document.imageUrl ? (
        <img src={document.imageUrl} alt={document.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
          <FileText className="w-16 h-16 text-purple-400" />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
            {document.category}
          </span>
          <span className="text-xs text-gray-500">{document.fileSize}</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2">{document.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{document.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-white">${document.price}</span>
            <span className="text-gray-500 text-sm ml-2">{document.downloads} sold</span>
          </div>

          <Link
            href={`/documents/${document.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
