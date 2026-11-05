"use client";

import React, { useState } from "react";
import { Folder, Upload, Download, Eye, FileText, CheckCircle2, X, Loader2, AlertCircle } from "lucide-react";
import { useEmployeeFilesQuery, useEmployeeProjectsQuery } from "@/hooks/use-api-queries";
import { toast } from "sonner";

export default function EmployeeFilesPage() {
  const { data: remoteFiles = [], isLoading, isError, error } = useEmployeeFilesQuery();
  const { data: projects = [] } = useEmployeeProjectsQuery();
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form State
  const [fileName, setFileName] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) {
      toast.error("Please enter a deliverable title or select a file.");
      return;
    }
    toast.info("Deliverable upload submitted to administrative review queue.");
    setShowUploadModal(false);
    setFileName("");
  };

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Folder className="w-6 h-6 text-amber-400" />
            <span>Assigned Files & Deliverable Vault</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access assigned project specifications, download assets, and upload deliverables.
          </p>
        </div>

        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Deliverable</span>
        </button>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Assigned Documents & Asset Files</h2>
          <span className="text-xs text-slate-400 font-semibold">{remoteFiles.length} files available</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span>Loading deliverable vault...</span>
          </div>
        ) : isError ? (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Failed to load files: {error instanceof Error ? error.message : "Network error"}</span>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="p-3">File Name</th>
                  <th className="p-3">Category / Folder</th>
                  <th className="p-3">Format</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {remoteFiles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No files or deliverables attached yet. Use the button above to upload a deliverable.
                    </td>
                  </tr>
                ) : (
                  remoteFiles.map((f: any) => {
                    const sizeInKb = f.bytes ? `${(f.bytes / 1024).toFixed(1)} KB` : "Document";
                    const fileDate = f.createdAt ? new Date(f.createdAt).toLocaleDateString() : "Active";
                    const downloadUrl = f.secureUrl || f.url;

                    return (
                      <tr key={f._id || f.filename} className="hover:bg-slate-800/40 transition-all">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span>{f.filename}</span>
                        </td>
                        <td className="p-3 text-slate-300">{f.folder || "Deliverable"}</td>
                        <td className="p-3 font-mono text-cyan-400 uppercase">{f.format || "PDF"}</td>
                        <td className="p-3 text-slate-400">{sizeInKb}</td>
                        <td className="p-3 text-slate-400">{fileDate}</td>
                        <td className="p-3 text-right space-x-2">
                          {downloadUrl && (
                            <a 
                              href={downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                              title="Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {downloadUrl && (
                            <a 
                              href={downloadUrl}
                              download
                              className="inline-block p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">Upload Deliverable</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Deliverable Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sprint-4-Architecture-Review.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Associated Project</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                >
                  <option value="">Select an assigned project...</option>
                  {projects.map((p: any) => (
                    <option key={p._id || p.title} value={p.title}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Submit Deliverable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}