"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  useAdminClientByIdQuery, 
  useUpdateAdminClientMutation, 
  useCreateAdminProjectMutation,
  useUpdateAdminProjectMutation,
  useAdminProjectsQuery,
  useAdminTasksQuery,
  useAdminInvoicesQuery
} from "@/hooks/use-api-queries";
import {
  ArrowLeft, Building2, MapPin, Globe, Mail, Phone, Calendar,
  ShieldCheck, FolderKanban, CheckSquare, FileSpreadsheet,
  TrendingUp, Edit, Trash2, Users, Plus, X
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AdminModal } from "@/components/admin/admin-modal";

export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const { data: client, isLoading, error } = useAdminClientByIdQuery(clientId);
  
  const { data: projects = [] } = useAdminProjectsQuery();
  const { data: tasks = [] } = useAdminTasksQuery();
  const { data: invoices = [] } = useAdminInvoicesQuery();

  const updateClientMutation = useUpdateAdminClientMutation();
  const createProjectMutation = useCreateAdminProjectMutation();
  const updateProjectMutation = useUpdateAdminProjectMutation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Client edit form state
  const [clientForm, setClientForm] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    address: "",
    gstNumber: "",
    tier: "Scaleup" as "Startup" | "Scaleup" | "Enterprise",
    contractValue: 0,
    slaUptimeTarget: "99.99%",
    status: "active" as "active" | "inactive",
    notes: "",
  });

  // Project creation form state
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "Web Development",
    progressPercentage: 0,
    status: "discovery" as "discovery" | "in_development" | "qa_testing" | "deployed" | "completed",
    estimatedCompletion: "",
  });

  useEffect(() => {
    if (client) {
      setClientForm({
        companyName: client.companyName || "",
        ownerName: client.ownerName || "",
        email: client.email || "",
        phone: client.phone || "",
        website: client.website || "",
        industry: client.industry || "",
        address: client.address || "",
        gstNumber: client.gstNumber || "",
        tier: client.tier || "Scaleup",
        contractValue: client.contractValue || 0,
        slaUptimeTarget: client.slaUptimeTarget || "99.99%",
        status: client.status || "active",
        notes: client.notes || "",
      });
    }
  }, [client]);

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

  // Filter projects, tasks, and invoices for this client
  const clientProjects = projects.filter((p: any) => {
    const pClientId = (p.clientId && typeof p.clientId === "object") ? p.clientId._id : p.clientId;
    return pClientId === clientId;
  });

  const clientInvoices = invoices.filter((i: any) => {
    const iClientId = (i.clientId && typeof i.clientId === "object") ? i.clientId._id : i.clientId;
    return iClientId === clientId;
  });

  const projectIds = clientProjects.map((p: any) => p._id || p.id);
  const clientTasks = tasks.filter((t: any) => {
    const tProjectId = (t.projectId && typeof t.projectId === "object") ? t.projectId._id : t.projectId;
    return projectIds.includes(tProjectId);
  });

  const activeProjectsCount = clientProjects.filter((p: any) => p.status !== "completed").length;
  const completedTasksCount = clientTasks.filter((t: any) => t.status === "completed").length;
  const invoicesCount = clientInvoices.length;

  const handleUpdateClient = (e: React.FormEvent) => {
    e.preventDefault();
    updateClientMutation.mutate({
      id: clientId,
      ...clientForm
    }, {
      onSuccess: () => {
        toast.success("Client profile updated successfully");
        setIsEditModalOpen(false);
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to update client profile");
      }
    });
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate({
      ...projectForm,
      clientId: clientId,
      estimatedCompletion: projectForm.estimatedCompletion ? new Date(projectForm.estimatedCompletion).toISOString() : undefined,
    }, {
      onSuccess: () => {
        toast.success("Project created successfully");
        setIsProjectModalOpen(false);
        setProjectForm({
          title: "",
          category: "Web Development",
          progressPercentage: 0,
          status: "discovery",
          estimatedCompletion: "",
        });
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to create project");
      }
    });
  };

  const handleAssignProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return;
    }
    updateProjectMutation.mutate({
      id: selectedProjectId,
      clientId: clientId
    }, {
      onSuccess: () => {
        toast.success("Project assigned successfully");
        setIsAssignModalOpen(false);
        setSelectedProjectId("");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to assign project");
      }
    });
  };

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
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-sm transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
          <button 
            onClick={() => setIsProjectModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all"
          >
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
                <span className="font-bold text-slate-900 dark:text-white">₹{client.contractValue?.toLocaleString("en-IN") || 0}</span>
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
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{activeProjectsCount}</div>
              <div className="text-xs text-slate-500">Active Projects</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mb-2">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{completedTasksCount}</div>
              <div className="text-xs text-slate-500">Completed Tasks</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 mb-2">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{invoicesCount}</div>
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
            
            {clientProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center space-y-4 text-slate-500">
                <FolderKanban className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No active projects yet.</p>
                  <p className="text-sm mt-1">Assign a project to this client to see it here.</p>
                </div>
                <button 
                  onClick={() => setIsAssignModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-xs"
                >
                  Assign Project
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {clientProjects.map((project: any) => (
                  <div key={project._id || project.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">{project.title}</h4>
                      <p className="text-xs text-slate-500">{project.category}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${project.progressPercentage || 0}%` }} />
                        </div>
                        <span className="text-xs font-bold">{project.progressPercentage || 0}%</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                        project.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                          : project.status === "in_development" || project.status === "qa_testing"
                          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
                      }`}>
                        {project.status === "discovery" && "🔍 Discovery"}
                        {project.status === "in_development" && "💻 In Development"}
                        {project.status === "qa_testing" && "🧪 QA Testing"}
                        {project.status === "deployed" && "🚀 Deployed"}
                        {project.status === "completed" && "🟢 Completed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Client Profile"
      >
        <form onSubmit={handleUpdateClient} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={clientForm.companyName}
                onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Primary Contact</label>
              <input
                type="text"
                required
                value={clientForm.ownerName}
                onChange={(e) => setClientForm({ ...clientForm, ownerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={clientForm.email}
                onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
              <input
                type="text"
                value={clientForm.phone}
                onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Website</label>
              <input
                type="text"
                value={clientForm.website}
                onChange={(e) => setClientForm({ ...clientForm, website: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Industry</label>
              <input
                type="text"
                required
                value={clientForm.industry}
                onChange={(e) => setClientForm({ ...clientForm, industry: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Address</label>
              <input
                type="text"
                value={clientForm.address}
                onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">GST/Tax Number</label>
              <input
                type="text"
                value={clientForm.gstNumber}
                onChange={(e) => setClientForm({ ...clientForm, gstNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tier</label>
              <select
                value={clientForm.tier}
                onChange={(e) => setClientForm({ ...clientForm, tier: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              >
                <option value="Startup">Startup</option>
                <option value="Scaleup">Scaleup</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select
                value={clientForm.status}
                onChange={(e) => setClientForm({ ...clientForm, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contract Value (₹ INR)</label>
              <input
                type="number"
                value={clientForm.contractValue}
                onChange={(e) => setClientForm({ ...clientForm, contractValue: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Uptime SLA Target</label>
              <input
                type="text"
                value={clientForm.slaUptimeTarget}
                onChange={(e) => setClientForm({ ...clientForm, slaUptimeTarget: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Internal Notes</label>
            <textarea
              rows={3}
              value={clientForm.notes}
              onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              placeholder="Add professional internal CRM notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-750 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateClientMutation.isPending}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-50"
            >
              {updateClientMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* New Project Modal */}
      <AdminModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4 text-sm">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
            <input
              type="text"
              required
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              placeholder="E.g., Cloud Migration Phase 1"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <input
              type="text"
              required
              value={projectForm.category}
              onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={projectForm.progressPercentage}
                onChange={(e) => setProjectForm({ ...projectForm, progressPercentage: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select
                value={projectForm.status}
                onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
              >
                <option value="discovery">🔍 Discovery</option>
                <option value="in_development">💻 In Development</option>
                <option value="qa_testing">🧪 QA Testing</option>
                <option value="deployed">🚀 Deployed</option>
                <option value="completed">🟢 Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Deadline</label>
            <input
              type="date"
              value={projectForm.estimatedCompletion}
              onChange={(e) => setProjectForm({ ...projectForm, estimatedCompletion: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-750 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProjectMutation.isPending}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-50"
            >
              {createProjectMutation.isPending ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Assign Project Modal */}
      <AdminModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Existing Project to Client"
      >
        <form onSubmit={handleAssignProject} className="space-y-4 text-sm">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Project</label>
            <select
              required
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 outline-none"
            >
              <option value="">-- Select Project --</option>
              {projects
                .filter((p: any) => {
                  const pClientId = (p.clientId && typeof p.clientId === "object") ? p.clientId._id : p.clientId;
                  return pClientId !== clientId;
                })
                .map((project: any) => (
                  <option key={project._id || project.id} value={project._id || project.id}>
                    {project.title} ({project.category})
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-750 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateProjectMutation.isPending}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-50"
            >
              {updateProjectMutation.isPending ? "Assigning..." : "Assign Project"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
