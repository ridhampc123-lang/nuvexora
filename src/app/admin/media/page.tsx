"use client";

import React, { useState } from "react";
import { Upload, Copy, Check, Trash2, Image as ImageIcon, FileText } from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  uploadedAt: string;
}

const initialMedia: MediaItem[] = [
  { id: "1", name: "hero-dashboard-preview.png", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71", size: "1.4 MB", uploadedAt: "Jul 18, 2026" },
  { id: "2", name: "veloce-banking-architecture.jpg", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5", size: "840 KB", uploadedAt: "Jul 15, 2026" },
  { id: "3", name: "apex-health-portal-cover.png", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d", size: "2.1 MB", uploadedAt: "Jul 10, 2026" },
];

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setMediaList(mediaList.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Upload Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Cloudinary Media Library</h1>
          <p className="text-xs text-slate-500 mt-1">Upload and copy Cloudinary CDN image URLs for articles, case studies, and hero assets.</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Upload Asset</span>
        </button>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mediaList.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm overflow-hidden flex flex-col justify-between group">
            <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-100 mb-3 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-900 truncate">{item.name}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.size} • {item.uploadedAt}</div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleCopyUrl(item.id, item.url)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedId === item.id ? "Copied URL" : "Copy URL"}</span>
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
