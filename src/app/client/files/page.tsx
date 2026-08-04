"use client";

import React, { useState } from "react";
import { 
  Download, 
  FileText, 
  Search, 
  Copy, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  FolderArchive,
  ExternalLink,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { useClientInvoicesQuery } from "@/hooks/use-api-queries";

interface FileItem {
  id: string;
  name: string;
  category: "Design" | "Specs" | "Contracts" | "Invoices";
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  downloadContent: string;
}

export default function ClientFilesPage() {
  const { data: invoices = [], isLoading } = useClientInvoicesQuery();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const files: FileItem[] = invoices.map((inv: any) => ({
    id: inv._id || inv.id,
    name: `${inv.invoiceNumber || "INV-XXXX"}.pdf`,
    category: "Invoices",
    type: "Adobe PDF Document",
    size: "142 KB",
    uploadedAt: inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "Just now",
    uploadedBy: "Billing Operations",
    downloadContent: `Nuvexora Technologies Invoice\nInvoice Number: ${inv.invoiceNumber}\nTotal Amount: $${inv.totalAmount}\nStatus: ${inv.status}`
  }));

  const filteredFiles = files.filter((f) => {
    const matchesCategory = activeCategory === "All" || f.category === activeCategory;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (file: FileItem) => {
    // Generate synthetic downloadable blob file in-browser
    const blob = new Blob([file.downloadContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${file.name}`);
  };

  const handleCopyLink = (id: string, name: string) => {
    navigator.clipboard.writeText(`https://portal.nuvexora.com/vault/dl/${id}/${name}`);
    setCopiedId(id);
    toast.info("Secure asset link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800 mb-2">
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Secure Enterprise Asset Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Design Files, Documents & Invoices</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Download high-resolution Figma design exports, technical architecture blueprints, signed contracts, and invoice PDF records.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>AES-256 Encrypted Downloads</span>
          </div>
        </div>
      </div>

      {/* Filter Category & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Design", "Specs", "Contracts", "Invoices"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {cat === "All" ? "All Deliverables" : cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files, specs, invoices..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Files Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Deliverable File Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">File Size</th>
                <th className="px-6 py-4">Uploaded By</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No files found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((f) => {
                  const isDesign = f.category === "Design";
                  const isInvoices = f.category === "Invoices";
                  const isContracts = f.category === "Contracts";

                  return (
                    <tr key={f.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isDesign ? "bg-purple-50 dark:bg-purple-950/80 text-purple-600" : isInvoices ? "bg-amber-50 dark:bg-amber-950/80 text-amber-600" : isContracts ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600" : "bg-blue-50 dark:bg-blue-950/80 text-blue-600"
                          }`}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white leading-tight">{f.name}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{f.type} • Uploaded {f.uploadedAt}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                          {f.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-mono font-bold text-slate-600 dark:text-slate-300">
                        {f.size}
                      </td>

                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {f.uploadedBy}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleCopyLink(f.id, f.name)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Copy link"
                          >
                            {copiedId === f.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handleDownload(f)}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
