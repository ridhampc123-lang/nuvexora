"use client";

import React, { useState } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminProjectsQuery, useUpdateAdminProjectMutation, useCreateAdminProjectMutation, useDeleteAdminProjectMutation, useAdminClientsQuery } from "@/hooks/use-api-queries";
import { AdminModal } from "@/components/admin/admin-modal";
import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ProjectItem {
  _id?: string;
  id?: string;
  title: string;
  clientId: any;
  category: string;
  progressPercentage: number;
  status: "discovery" | "in_development" | "qa_testing" | "deployed" | "completed";
  estimatedCompletion: string;
}

export default function ProjectsCMSPage() {
  const { data: projects = [], isLoading } = useAdminProjectsQuery();
  const { data: clients = [] } = useAdminClientsQuery();
  const updateProjectMutation = useUpdateAdminProjectMutation();
  const createProjectMutation = useCreateAdminProjectMutation();
  const deleteProjectMutation = useDeleteAdminProjectMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    clientId: "",
    category: "Web Development",
    progressPercentage: 0,
    status: "discovery" as "discovery" | "in_development" | "qa_testing" | "deployed" | "completed",
    estimatedCompletion: "",
  });

  const handleOpenModal = (project?: ProjectItem) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        clientId: typeof project.clientId === 'object' ? project.clientId._id : project.clientId,
        category: project.category || "Web Development",
        progressPercentage: project.progressPercentage || 0,
        status: project.status || "discovery",
        estimatedCompletion: project.estimatedCompletion ? new Date(project.estimatedCompletion).toISOString().split('T')[0] : "",
      });
    } else {
      setEditingProject(null);
      setFormData({ title: "", clientId: "", category: "Web Development", progressPercentage: 0, status: "discovery", estimatedCompletion: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      estimatedCompletion: formData.estimatedCompletion ? new Date(formData.estimatedCompletion).toISOString() : undefined,
    };

    if (editingProject) {
      const projectId = editingProject._id || editingProject.id || "";
      updateProjectMutation.mutate({ id: projectId, ...payload }, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success("Project updated successfully");
        }
      });
    } else {
      createProjectMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success("Project created successfully");
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(id);
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    updateProjectMutation.mutate({ id, status: newStatus });
  };

  const columns: Column<ProjectItem>[] = [
    { header: "Project Name", accessorKey: "title" },
    { 
      header: "Client", 
      cell: (row) => row.clientId?.name || row.clientId?.companyName || "Unknown Client"
    },
    { header: "Category", accessorKey: "category" },
    {
      header: "Delivery Progress",
      cell: (row) => (
        <div className="flex items-center gap-3 w-44">
          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${row.progressPercentage}%` }} />
          </div>
          <span className="text-xs font-bold text-slate-800">{row.progressPercentage}%</span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => {
        const projectId = row._id || row.id || "";
        return (
          <select
            value={row.status}
            onChange={(e) => handleStatusChange(projectId, e.target.value)}
            disabled={updateProjectMutation.isPending}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border outline-none ${
              row.status === "completed"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : row.status === "in_development" || row.status === "qa_testing"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            <option value="discovery">🔍 Discovery</option>
            <option value="in_development">💻 In Development</option>
            <option value="qa_testing">🧪 QA Testing</option>
            <option value="deployed">🚀 Deployed</option>
            <option value="completed">🟢 Completed</option>
          </select>
        );
      },
    },
    { 
      header: "Target Deadline", 
      cell: (row) => row.estimatedCompletion ? new Date(row.estimatedCompletion).toLocaleDateString() : "Not set" 
    },
    {
      header: "Actions",
      cell: (row) => {
        const projectId = row._id || row.id || "";
        return (
          <div className="flex items-center gap-2">
            <button onClick={() => handleOpenModal(row)} className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleDelete(projectId)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AdminDataTable
        title="Client Projects & Delivery Milestone Tracker"
        description="Monitor active engineering sprints, project delivery percentage, and client milestones dynamically."
        columns={columns}
        data={isLoading ? [] : projects}
        searchPlaceholder="Search projects..."
        onAddNew={() => handleOpenModal()}
        addNewLabel="New Project"
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Edit Project" : "Create New Project"}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Project Name</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Client</label>
            <select
              required
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
            >
              <option value="">-- Select Client --</option>
              {clients.map((c: any) => (
                <option key={c._id} value={c._id}>{c.name || c.companyName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Category</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progressPercentage}
                onChange={(e) => setFormData({ ...formData, progressPercentage: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
              >
                <option value="discovery">Discovery</option>
                <option value="in_development">In Development</option>
                <option value="qa_testing">QA Testing</option>
                <option value="deployed">Deployed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Deadline</label>
            <input
              type="date"
              required
              value={formData.estimatedCompletion}
              onChange={(e) => setFormData({ ...formData, estimatedCompletion: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">
              Cancel
            </button>
            <button type="submit" disabled={createProjectMutation.isPending || updateProjectMutation.isPending} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">
              {createProjectMutation.isPending || updateProjectMutation.isPending ? "Saving..." : "Save Project"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

