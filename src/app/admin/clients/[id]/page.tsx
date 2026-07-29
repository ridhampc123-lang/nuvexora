"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdminClientByIdQuery } from "@/hooks/use-api-queries";
import {
  ArrowLeft, Building2, MapPin, Globe, Mail, Phone, Calendar,
  ShieldCheck, FolderKanban, CheckSquare, FileSpreadsheet,
  TrendingUp, Edit, Trash2, Users
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const { data: client, isLoading, error } = useAdminClientByIdQuery(clientId);

  if (isLoading) {
    return <div className="p-10 text-center text-slate-500">Loading client profile...</div>;
  }

  if (error || !client) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Client Not Found</h2>
        <button onClick={() => router.push("/admin/clients")} className="text-blue-500 hover:underline">
          Return to clients
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-6xl mx-auto text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <button
          onClick={() => router.push("/admin/clients")}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {client.companyName}
            </h1>
            <span className="text-[10px] font-mono text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
              {client.tier}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {client.industry} • Account ID: <span className="font-mono text-xs">{client._id}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-sm transition-colors">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all">
            <FolderKanban className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Client Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              Company Details
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Users className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-slate-500 text-xs">Primary Contact</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{client.ownerName}</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-slate-500 text-xs">Email</div>
                  <a href={`mailto:${client.email}`} className="text-blue-500 hover:underline">{client.email}</a>
                </div>
              </li>
              {client.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-slate-500 text-xs">Phone</div>
                    <div className="text-slate-900 dark:text-white">{client.phone}</div>
                  </div>
                </li>
              )}
              {client.website && (
                <li className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-slate-500 text-xs">Website</div>
                    <a href={client.website} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{client.website.replace("https://", "")}</a>
                  </div>
                </li>
              )}
              {client.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-slate-500 text-xs">Address</div>
                    <div className="text-slate-900 dark:text-white">{client.address}</div>
                  </div>
                </li>
              )}
              {client.gstNumber && (
                <li className="flex items-start gap-3">
                  <FileSpreadsheet className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-slate-500 text-xs">GST/Tax Number</div>
                    <div className="text-slate-900 dark:text-white">{client.gstNumber}</div>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              Contract & SLA
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-slate-500">Contract Value</span>
                <span className="font-bold text-slate-900 dark:text-white">${client.contractValue?.toLocaleString() || 0}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-500">Uptime SLA</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">{client.slaUptimeTarget}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-bold uppercase text-[10px] text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded tracking-widest">{client.status}</span>
              </li>
              <li className="flex flex-col gap-1 mt-4">
                <span className="text-slate-500 text-xs">Internal Notes</span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">
                  {client.notes || "No notes provided."}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Projects & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 mb-2">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
              <div className="text-xs text-slate-500">Active Projects</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mb-2">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
              <div className="text-xs text-slate-500">Completed Tasks</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 mb-2">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
              <div className="text-xs text-slate-500">Invoices</div>
            </div>
          </div>

          {/* Active Projects List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm min-h-[300px]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Client Projects</h3>
              <Link href="/admin/projects" className="text-sm font-semibold text-blue-500 hover:underline">
                View All
              </Link>
            </div>
            
            <div className="flex flex-col items-center justify-center h-48 text-center space-y-4 text-slate-500">
              <FolderKanban className="w-12 h-12 text-slate-300 dark:text-slate-700" />
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">No active projects yet.</p>
                <p className="text-sm mt-1">Assign a project to this client to see it here.</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-xs">
                Assign Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
