"use client";

import React, { useState } from "react";
import { Upload, Copy, Check, Trash2, Image as ImageIcon, FileText } from "lucide-react";
import { useAdminMediaQuery, useDeleteAdminMediaMutation } from "@/hooks/use-api-queries";
import { uploadAdminImage } from "@/lib/api/admin-api";
import { toast } from "sonner";

export default function MediaLibraryPage() {
  const { data: dbMedia = [], isLoading, refetch } = useAdminMediaQuery();
  const deleteMutation = useDeleteAdminMediaMutation();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Media item deleted"),
      onError: () => toast.error("Failed to delete media item")
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadAdminImage(file);
      toast.success("Asset uploaded successfully");
      refetch();
    } catch {
      toast.error("Asset upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Upload Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Cloudinary Media Library</h1>
          <p className="text-xs text-slate-500 mt-1">Upload and copy Cloudinary CDN image URLs for articles, case studies, and hero assets.</p>
        </div>

        <label className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{uploading ? "Uploading..." : "Upload Asset"}</span>
          <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" disabled={uploading} />
        </label>
      </div>

      {/* Media Grid */}
      {dbMedia.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dbMedia.map((item: any) => (
            <div key={item._id || item.id} className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm overflow-hidden flex flex-col justify-between group">
              <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-100 mb-3 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.name || "Media Asset"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>

              <div>
                <div className="text-xs font-bold text-slate-900 truncate">{item.name || item.filename || "CDN Media File"}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : "CDN Asset"}</div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleCopyUrl(item._id || item.id, item.url)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedId === (item._id || item.id) ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === (item._id || item.id) ? "Copied URL" : "Copy URL"}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item._id || item.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-700">No Media Assets Uploaded</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Upload media files to Cloudinary CDN to manage images for marketing and portfolio showcases.</p>
        </div>
      )}
    </div>
  );
}
