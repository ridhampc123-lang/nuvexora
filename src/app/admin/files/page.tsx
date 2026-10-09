"use client";

import React, { useState, useRef } from "react";
import { FolderOpen, Upload, FileText, Image as ImageIcon, Shield, Download, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminMediaQuery, useDeleteAdminMediaMutation } from "@/hooks/use-api-queries";
import { uploadAdminImage } from "@/lib/api/admin-api";
import { useQueryClient } from "@tanstack/react-query";

export default function FilesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: mediaList = [], isLoading } = useAdminMediaQuery();
  const deleteMutation = useDeleteAdminMediaMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadAdminImage(file);
      queryClient.invalidateQueries({ queryKey: ["adminMedia"] });
      toast.success(`Successfully uploaded asset: ${file.name}`);
    } catch (err: any) {
      toast.error("Upload failed: " + (err.message || "Unknown error"));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Removed asset: ${name}`);
    } catch (err: any) {
      toast.error("Failed to delete asset: " + (err.message || "Unknown error"));
    }
  };

  const filteredFiles = mediaList.filter((f: any) =>
    (f.filename || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBytes = mediaList.reduce((acc: number, f: any) => acc + (f.bytes || 0), 0);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.zip,.doc,.docx"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-widest">
            <FolderOpen className="w-4 h-4" />
            <span>Cloud Storage & Digital Asset Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Enterprise Asset Storage</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Manage encrypted corporate documents, client deliverables, and system media assets.</p>
        </div>

        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
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

      {/* Storage Indicator & Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter file assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="text-right w-full sm:w-auto">
          <div className="text-xs font-bold text-slate-900 dark:text-white">
            {totalMB} MB / 10 GB Storage ({((Number(totalMB) / 10240) * 100).toFixed(2)}%)
          </div>
          <div className="w-48 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-1 ml-auto">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${Math.min(100, Math.max(1, (Number(totalMB) / 10240) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* File List Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span>Loading storage assets...</span>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FolderOpen className="w-10 h-10 text-slate-400 mx-auto stroke-1" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No assets found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">Upload new files to populate your enterprise asset storage.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                <th className="p-4 pl-6">Asset Name</th>
                <th className="p-4">Format</th>
                <th className="p-4">Size</th>
                <th className="p-4">Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              {filteredFiles.map((file: any) => (
                <tr key={file._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="truncate max-w-xs">{file.filename}</span>
                  </td>
                  <td className="p-4 uppercase text-[10px] font-mono font-bold text-slate-400">{file.format || "bin"}</td>
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                    {file.bytes ? `${(file.bytes / 1024).toFixed(1)} KB` : "N/A"}
                  </td>
                  <td className="p-4 font-mono text-slate-400">
                    {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : "Recent"}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={file.secureUrl || file.url}
                        target="_blank"
                        rel="noreferrer"
                        download={file.filename}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                        title="Download / View Asset"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDelete(file._id, file.filename)}
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
