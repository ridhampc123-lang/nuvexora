"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Copy,
  Check,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Search,
  Maximize2,
  X,
  FileImage,
  RefreshCw,
} from "lucide-react";
import { useAdminMediaQuery, useDeleteAdminMediaMutation } from "@/hooks/use-api-queries";
import { uploadAdminImage } from "@/lib/api/admin-api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface MediaItem {
  _id: string;
  id?: string;
  filename?: string;
  name?: string;
  publicId?: string;
  url: string;
  secureUrl?: string;
  format?: string;
  bytes?: number;
  folder?: string;
  createdAt?: string;
  uploadedAt?: string;
}

export default function MediaLibraryPage() {
  const queryClient = useQueryClient();
  const { data: dbMedia = [], isLoading, refetch } = useAdminMediaQuery();
  const deleteMutation = useDeleteAdminMediaMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolveMediaUrl = (url?: string): string => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    const backendBase = (process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000").replace(/\/$/, "");
    return `${backendBase}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const handleCopyUrl = (id: string, url: string) => {
    const fullUrl = resolveMediaUrl(url);
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast.success("Asset URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string, name?: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success(`Deleted asset${name ? `: ${name}` : ""}`);
        queryClient.invalidateQueries({ queryKey: ["adminMedia"] });
        if (previewMedia?._id === id || previewMedia?.id === id) {
          setPreviewMedia(null);
        }
      },
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : "Unknown error";
        toast.error("Failed to delete media item: " + message);
      },
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadAdminImage(file);
      toast.success(`Asset "${file.name}" uploaded successfully`);
      await queryClient.invalidateQueries({ queryKey: ["adminMedia"] });
      refetch();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload error";
      toast.error("Asset upload failed: " + message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes <= 0) return "0 B";
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const mediaList: MediaItem[] = Array.isArray(dbMedia) ? (dbMedia as MediaItem[]) : [];

  const filteredMedia = mediaList.filter((item) => {
    const query = searchTerm.toLowerCase();
    const filename = (item.filename || item.name || "").toLowerCase();
    const format = (item.format || "").toLowerCase();
    return filename.includes(query) || format.includes(query);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Upload Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900">Media Library & Asset Storage</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60">
              {mediaList.length} Assets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload, manage, and copy CDN URLs for marketing articles, portfolio projects, and showcase assets.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => {
              refetch();
              queryClient.invalidateQueries({ queryKey: ["adminMedia"] });
            }}
            title="Refresh assets"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer select-none">
            {uploading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? "Uploading..." : "Upload Asset"}</span>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Filter / Search Bar */}
      {mediaList.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets by file name or format (e.g. png, banner, hero)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200/90 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      )}

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm animate-pulse space-y-3">
              <div className="h-44 w-full bg-slate-200 rounded-2xl" />
              <div className="h-4 bg-slate-200 rounded-md w-3/4" />
              <div className="h-3 bg-slate-100 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredMedia.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.map((item) => {
            const itemId = item._id || item.id || "";
            const fullUrl = resolveMediaUrl(item.url || item.secureUrl);
            const isFailed = failedImages[itemId];
            const isLocal = Boolean(item.publicId?.startsWith("local-") || item.url?.includes("/uploads/"));

            return (
              <div
                key={itemId}
                className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-blue-200 hover:shadow-md transition-all"
              >
                {/* Image Container / Fallback */}
                <div
                  onClick={() => !isFailed && setPreviewMedia(item)}
                  className="h-44 w-full rounded-2xl overflow-hidden bg-slate-100 mb-3 relative flex items-center justify-center cursor-pointer group-hover:bg-slate-200/70 transition-colors"
                >
                  {isFailed ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400">
                      <FileImage className="w-10 h-10 mb-1.5 text-slate-300" />
                      <span className="text-[11px] font-semibold text-slate-600 truncate max-w-[180px]">
                        {item.filename || item.name || "Asset"}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wide font-mono">
                        {item.format || "Image"}
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fullUrl}
                        alt={item.filename || item.name || "Media Asset"}
                        onError={() => setFailedImages((prev) => ({ ...prev, [itemId]: true }))}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="p-2 rounded-full bg-white/90 text-slate-800 shadow-sm backdrop-blur-xs">
                          <Maximize2 className="w-4 h-4" />
                        </span>
                      </div>
                    </>
                  )}

                  {/* Storage Provider Badge */}
                  <span
                    className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs ${
                      isLocal
                        ? "bg-slate-900/70 text-slate-100"
                        : "bg-blue-600/80 text-white"
                    }`}
                  >
                    {isLocal ? "Local Storage" : "Cloudinary CDN"}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <div
                    className="text-xs font-bold text-slate-900 truncate"
                    title={item.filename || item.name || "CDN Media File"}
                  >
                    {item.filename || item.name || "CDN Media File"}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : item.uploadedAt
                        ? new Date(item.uploadedAt).toLocaleDateString()
                        : "Recent"}
                    </span>
                    <span>{formatBytes(item.bytes)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleCopyUrl(itemId, fullUrl)}
                      className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedId === itemId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === itemId ? "Copied URL" : "Copy URL"}</span>
                    </button>

                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open in new tab"
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => handleDelete(itemId, item.filename || item.name)}
                      title="Delete asset"
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-700">
            {searchTerm ? "No assets matching search" : "No Media Assets Uploaded"}
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm
              ? "Try searching for a different keyword or format."
              : "Upload images and assets to use them across your marketing articles, case studies, and hero showcases."}
          </p>
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="truncate pr-4">
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {previewMedia.filename || previewMedia.name || "Asset Preview"}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {formatBytes(previewMedia.bytes)} • {previewMedia.format?.toUpperCase() || "IMAGE"} •{" "}
                  {previewMedia.createdAt ? new Date(previewMedia.createdAt).toLocaleDateString() : "Recent"}
                </p>
              </div>

              <button
                onClick={() => setPreviewMedia(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] bg-slate-950 flex items-center justify-center overflow-hidden p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveMediaUrl(previewMedia.url || previewMedia.secureUrl)}
                alt={previewMedia.filename || "Preview"}
                className="max-h-[55vh] max-w-full object-contain rounded-lg"
              />
            </div>

            <div className="p-4 bg-slate-50 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 font-mono truncate flex-1 select-all">
                {resolveMediaUrl(previewMedia.url || previewMedia.secureUrl)}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyUrl(previewMedia._id || previewMedia.id || "", previewMedia.url)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {copiedId === (previewMedia._id || previewMedia.id) ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === (previewMedia._id || previewMedia.id) ? "Copied" : "Copy URL"}</span>
                </button>

                <a
                  href={resolveMediaUrl(previewMedia.url || previewMedia.secureUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
