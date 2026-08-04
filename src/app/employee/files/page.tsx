"use client";

import React, { useState } from "react";
import { Folder, Upload, Download, Eye, FileText, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";

export default function EmployeeFilesPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form State
  const [fileName, setFileName] = useState("");
  const [project, setProject] = useState("Development Project");
  const [fileSize, setFileSize] = useState("1.5 MB");

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) {
      toast.error("Please enter a file name.");
      return;
    }

    const newFile = {
      name: fileName.endsWith(".pdf") || fileName.endsWith(".json") || fileName.endsWith(".png") ? fileName : `${fileName}.pdf`,
      project,
      size: fileSize,
      version: "v1.0",
      date: new Date().toISOString().split("T")[0]
    };

    setFiles([newFile, ...files]);
    toast.success(`Successfully uploaded deliverable: ${newFile.name}`);
    setFileName("");
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Folder className="w-6 h-6 text-amber-400" />
            <span>Assigned Files & Deliverable Vault</span>
          </h1>
          <p className="text-xs text-slate-400">
            Access assigned project specifications, download assets, and upload client deliverables.
          </p>
        </div>

        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Deliverable</span>
        </button>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold">Assigned Documents & Asset Files</h2>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="p-3">File Name</th>
                <th className="p-3">Project</th>
                <th className="p-3">Version</th>
                <th className="p-3">Size</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {files.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No files shared or uploaded. Use the button above to upload a deliverable.
                  </td>
                </tr>
              ) : (
                files.map((f) => (
                  <tr key={f.name} className="hover:bg-slate-800/40 transition-all">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span>{f.name}</span>
                    </td>
                    <td className="p-3 text-slate-300">{f.project}</td>
                    <td className="p-3 font-mono text-cyan-400">{f.version}</td>
                    <td className="p-3 text-slate-400">{f.size}</td>
                    <td className="p-3 text-slate-400">{f.date}</td>
                    <td className="p-3 text-right space-x-2">
                      <button 
                        onClick={() => toast.info(`Viewing preview for ${f.name}`)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => toast.success(`Downloaded ${f.name}`)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUploadSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-extrabold text-white">Upload New Deliverable</h3>
              <button 
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg hover:bg-slate-850 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. backend-api-spec.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Project Module</label>
                <input
                  type="text"
                  required
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Estimated Size (MB)</label>
                <input
                  type="text"
                  required
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-800 hover:bg-slate-855 text-xs font-bold text-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
              >
                Confirm Upload
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
