"use client";

import React, { useState, useRef } from "react";
import {
  FolderOpen,
  Upload,
  FileText,
  Image as ImageIcon,
  Download,
  Trash2,
  Search,
  Loader2,
  Eye,
  X,
  ExternalLink,
  Copy,
  Check,
  FileSpreadsheet,
  Archive,
  FileCode,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminMediaQuery, useDeleteAdminMediaMutation } from "@/hooks/use-api-queries";
import { uploadAdminImage } from "@/lib/api/admin-api";
import { useQueryClient } from "@tanstack/react-query";

interface MediaItem {
  _id: string;
  filename: string;
  publicId?: string;
  url: string;
  secureUrl?: string;
  format?: string;
  bytes?: number;
  folder?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function FilesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<MediaItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<"fit" | "full">("fit");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: mediaList = [], isLoading } = useAdminMediaQuery();
  const deleteMutation = useDeleteAdminMediaMutation();

  // Helper to determine asset category
  const resolveFileUrl = (url?: string): string => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
    const backendBase = (process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000").replace(/\/$/, "");
    return `${backendBase}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const getAssetCategory = (filename: string = "", format: string = "") => {
    const ext = (filename.split(".").pop() || format || "").toLowerCase();
    if (["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"].includes(ext)) return "image";
    if (["pdf"].includes(ext)) return "pdf";
    if (["doc", "docx", "odt", "rtf", "txt"].includes(ext)) return "document";
    if (["xls", "xlsx", "csv"].includes(ext)) return "spreadsheet";
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
    if (["json", "js", "ts", "html", "css", "py"].includes(ext)) return "code";
    return "other";
  };

  // Robust download handler with blob streaming
  const handleDownload = async (file: MediaItem) => {
    const fileId = file._id;
    const fileName = file.filename || "asset";
    const directUrl = file.secureUrl || file.url;

    setDownloadingId(fileId);
    toast.info(`Downloading ${fileName}...`);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("nuvexora_access_token") || localStorage.getItem("nuvexora_token")
          : null;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // 1. Try download via backend streaming route (bypasses CORS & sets exact filename header)
      let downloaded = false;
      try {
        const downloadUrl = token
          ? `/api/v1/admin/media/${fileId}/download?token=${encodeURIComponent(token)}`
          : `/api/v1/admin/media/${fileId}/download`;
        const res = await fetch(downloadUrl, { headers });
        if (res.ok) {
          const blob = await res.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
          downloaded = true;
        }
      } catch {
        // Fall back to direct fetch
      }

      // 2. Direct fetch fallback
      if (!downloaded && directUrl && !directUrl.startsWith("data:embedded-file")) {
        try {
          const directRes = await fetch(directUrl);
          if (directRes.ok) {
            const blob = await directRes.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            downloaded = true;
          }
        } catch {
          // Fall back to window.open
        }
      }

      // 3. Last-resort fallback
      if (!downloaded) {
        window.open(directUrl, "_blank");
      }

      toast.success(`Downloaded: ${fileName}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not retrieve asset file";
      toast.error(`Download failed: ${msg}`);
    } finally {
      setDownloadingId(null);
    }
  };

  // Upload handler
  const processUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await uploadAdminImage(file);
      await queryClient.invalidateQueries({ queryKey: ["adminMedia"] });
      toast.success(`Successfully uploaded: ${file.name}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error("Upload failed: " + msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processUpload(file);
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processUpload(file);
  };

  // Copy URL
  const handleCopyUrl = (id: string, url: string) => {
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast.success("Asset URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      if (selectedFile?._id === id) setSelectedFile(null);
      toast.success(`Removed asset: ${name}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error("Failed to delete asset: " + msg);
    }
  };

  const filteredFiles = mediaList.filter((f: MediaItem) =>
    (f.filename || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBytes = mediaList.reduce((acc: number, f: MediaItem) => acc + (f.bytes || 0), 0);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  // Render thumbnail icon or image preview
  const renderThumbnail = (file: MediaItem) => {
    const category = getAssetCategory(file.filename, file.format);
    const targetUrl = resolveFileUrl(file.secureUrl || file.url);

    if (category === "image" && targetUrl && !targetUrl.startsWith("data:embedded-file")) {
      return (
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 relative group/thumb">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={targetUrl}
            alt={file.filename}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide broken image and fall back to icon
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </div>
      );
    }

    if (category === "pdf") {
      return (
        <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-rose-600" />
        </div>
      );
    }

    if (category === "spreadsheet") {
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-center shrink-0">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
        </div>
      );
    }

    if (category === "archive") {
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center shrink-0">
          <Archive className="w-5 h-5 text-amber-600" />
        </div>
      );
    }

    if (category === "code") {
      return (
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center shrink-0">
          <FileCode className="w-5 h-5 text-indigo-600" />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-blue-600" />
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.zip,.doc,.docx,.xls,.xlsx,.csv,.txt,.json"
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-widest">
            <FolderOpen className="w-4 h-4" />
            <span>Digital Asset Storage & Content Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Enterprise Asset Storage</h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
            Secure asset repository with live inline previews, instant streaming downloads, and resilient storage backup.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="relative z-10 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading Asset...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Upload New Asset</span>
            </>
          )}
        </button>
      </div>

      {/* Drag & Drop Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
          isDragging
            ? "border-blue-500 bg-blue-50/80 dark:bg-blue-950/30 scale-[1.01]"
            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50/50"
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shadow-inner">
          <Upload className="w-6 h-6" />
        </div>
        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Drag & Drop assets here, or <span className="text-blue-600 dark:text-sky-400 underline decoration-2 underline-offset-4">browse files</span>
        </div>
        <div className="text-xs text-slate-400">
          Supports PNG, JPG, WEBP, SVG, PDF, DOCX, XLSX, ZIP, and text documents up to 50 MB
        </div>
      </div>

      {/* Storage Indicator & Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets by file name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="text-right w-full sm:w-auto">
          <div className="text-xs font-bold text-slate-900 dark:text-white">
            {totalMB} MB Storage Utilized ({mediaList.length} files)
          </div>
          <div className="w-56 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-1.5 ml-auto">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(2, (Number(totalMB) / 10240) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* File List Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-16 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span>Loading storage assets...</span>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto stroke-1" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {searchTerm ? "No matching assets found" : "No assets stored yet"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm
                ? "Try searching for a different file name or keyword."
                : "Upload images, documents, or reports to populate your enterprise asset storage."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                  <th className="p-4 pl-6">Asset</th>
                  <th className="p-4">Format</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Date Added</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                {filteredFiles.map((file: MediaItem) => {
                  const category = getAssetCategory(file.filename, file.format);
                  const isDownloading = downloadingId === file._id;

                  return (
                    <tr
                      key={file._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedFile(file)}
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          {renderThumbnail(file)}
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                              {file.filename}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                              <span className="capitalize">{category}</span>
                              {file.folder && (
                                <>
                                  <span>•</span>
                                  <span>{file.folder}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-mono font-bold tracking-wider">
                          {file.format || file.filename.split(".").pop() || "bin"}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                        {file.bytes
                          ? file.bytes > 1024 * 1024
                            ? `${(file.bytes / (1024 * 1024)).toFixed(2)} MB`
                            : `${(file.bytes / 1024).toFixed(1)} KB`
                          : "—"}
                      </td>

                      <td className="p-4 font-mono text-slate-400">
                        {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : "Recent"}
                      </td>

                      <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedFile(file)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Preview Asset"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Direct Download Button */}
                          <button
                            type="button"
                            onClick={() => handleDownload(file)}
                            disabled={isDownloading}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors disabled:opacity-50 cursor-pointer"
                            title="Download Asset"
                          >
                            {isDownloading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Copy Link Button */}
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(file._id, file.secureUrl || file.url)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            title="Copy Direct URL"
                          >
                            {copiedId === file._id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(file._id, file.filename)}
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 transition-colors cursor-pointer"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FULL ASSET PREVIEW MODAL */}
      {selectedFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                  {getAssetCategory(selectedFile.filename, selectedFile.format) === "image" ? (
                    <ImageIcon className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {selectedFile.filename}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                    <span className="uppercase font-bold text-blue-600 dark:text-sky-400">
                      {selectedFile.format || "bin"}
                    </span>
                    <span>•</span>
                    <span>
                      {selectedFile.bytes
                        ? selectedFile.bytes > 1024 * 1024
                          ? `${(selectedFile.bytes / (1024 * 1024)).toFixed(2)} MB`
                          : `${(selectedFile.bytes / 1024).toFixed(1)} KB`
                        : "Unknown size"}
                    </span>
                    <span>•</span>
                    <span>
                      {selectedFile.createdAt
                        ? new Date(selectedFile.createdAt).toLocaleDateString()
                        : "Uploaded recently"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {getAssetCategory(selectedFile.filename, selectedFile.format) === "image" && (
                  <button
                    type="button"
                    onClick={() => setZoomLevel(zoomLevel === "fit" ? "full" : "fit")}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                    title={zoomLevel === "fit" ? "Zoom 100%" : "Fit to screen"}
                  >
                    {zoomLevel === "fit" ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: File Viewport */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[65vh] flex items-center justify-center bg-slate-100/50 dark:bg-slate-950/40">
              {(() => {
                const category = getAssetCategory(selectedFile.filename, selectedFile.format);
                const fileUrl = resolveFileUrl(selectedFile.secureUrl || selectedFile.url);

                if (category === "image") {
                  return (
                    <div className="relative w-full flex items-center justify-center p-2 rounded-2xl bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fileUrl}
                        alt={selectedFile.filename}
                        className={`rounded-xl shadow-lg transition-all duration-200 ${
                          zoomLevel === "fit"
                            ? "max-h-[55vh] w-auto max-w-full object-contain"
                            : "w-full max-h-none object-none"
                        }`}
                      />
                    </div>
                  );
                }

                if (category === "pdf") {
                  return (
                    <div className="w-full h-[58vh] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white">
                      <iframe
                        src={fileUrl}
                        title={selectedFile.filename}
                        className="w-full h-full border-none"
                      />
                    </div>
                  );
                }

                // Document / Archive / Other File Inspection Card
                return (
                  <div className="py-12 px-6 text-center max-w-md mx-auto space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                      {category === "spreadsheet" ? (
                        <FileSpreadsheet className="w-10 h-10" />
                      ) : category === "archive" ? (
                        <Archive className="w-10 h-10" />
                      ) : category === "code" ? (
                        <FileCode className="w-10 h-10" />
                      ) : (
                        <FileText className="w-10 h-10" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {selectedFile.filename}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Native file preview is not directly embeddable for this format. Download or open externally to view full content.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                      <span>Format:</span>
                      <strong className="uppercase text-slate-900 dark:text-white">
                        {selectedFile.format || "file"}
                      </strong>
                      <span>•</span>
                      <span>ID:</span>
                      <strong className="text-slate-900 dark:text-white truncate max-w-[120px]">
                        {selectedFile.publicId || selectedFile._id}
                      </strong>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(selectedFile._id, selectedFile.secureUrl || selectedFile.url)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === selectedFile._id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={selectedFile.secureUrl || selectedFile.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedFile._id, selectedFile.filename)}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(selectedFile)}
                  disabled={downloadingId === selectedFile._id}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {downloadingId === selectedFile._id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
