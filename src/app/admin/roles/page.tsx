"use client";

import React, { useState } from "react";
import { ShieldCheck, UserCheck, Key, Plus, Edit2, Trash2, X, Check, CheckSquare, Square, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAdminRolesQuery, useCreateAdminRoleMutation, useUpdateAdminRoleMutation, useDeleteAdminRoleMutation, useAdminPermissionsQuery } from "@/hooks/use-api-queries";

export default function RolesPage() {
  const { data: dbRoles = [], isLoading: loadingRoles } = useAdminRolesQuery();
  const { data: allPermissions = [], isLoading: loadingPermissions } = useAdminPermissionsQuery();

  const createRoleMutation = useCreateAdminRoleMutation();
  const updateRoleMutation = useUpdateAdminRoleMutation();
  const deleteRoleMutation = useDeleteAdminRoleMutation();

  const [activeConfigRole, setActiveConfigRole] = useState<any | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);

  const defaultSystemRoles = [
    { id: "1", name: "SUPER_ADMIN", code: "SUPER_ADMIN", title: "Super Administrator", permissionsCount: "ALL (Wildcard)", description: "Full unrestricted system access, database mutations, and security policy control.", isDefault: true },
    { id: "2", name: "ADMIN", code: "ADMIN", title: "Systems Administrator", permissionsCount: "48 Active Directives", description: "Standard management access for CRM, projects, billing, and blog content.", isDefault: true },
    { id: "3", name: "CLIENT", code: "CLIENT", title: "Enterprise Client Lead", permissionsCount: "12 Client Directives", description: "Restricted workspace access for deliverable approvals, tasks, and invoice payments.", isDefault: true },
    { id: "4", name: "EMPLOYEE", code: "EMPLOYEE", title: "Engineering Staff", permissionsCount: "18 Staff Directives", description: "Access to task execution, milestone logging, attendance, and technical chat.", isDefault: true },
  ];

  const rolesToDisplay = dbRoles.length > 0 ? dbRoles : defaultSystemRoles;

  const handleOpenPermissionsModal = (role: any) => {
    setActiveConfigRole(role);
    const existingIds = (role.permissions || []).map((p: any) => (typeof p === "string" ? p : p._id));
    setSelectedPermissionIds(existingIds);
  };

  const handleTogglePermission = (id: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleToggleModule = (modulePermissions: any[]) => {
    const moduleIds = modulePermissions.map((p) => p._id);
    const allSelected = moduleIds.every((id) => selectedPermissionIds.includes(id));

    if (allSelected) {
      setSelectedPermissionIds((prev) => prev.filter((id) => !moduleIds.includes(id)));
    } else {
      setSelectedPermissionIds((prev) => Array.from(new Set([...prev, ...moduleIds])));
    }
  };

  const handleSavePermissions = () => {
    if (!activeConfigRole) return;
    if (!activeConfigRole._id) {
      toast.info(`Configured ${selectedPermissionIds.length} permissions for ${activeConfigRole.name}`);
      setActiveConfigRole(null);
      return;
    }

    updateRoleMutation.mutate(
      {
        id: activeConfigRole._id,
        permissions: selectedPermissionIds,
      },
      {
        onSuccess: () => {
          toast.success(`Updated ${selectedPermissionIds.length} permissions for ${activeConfigRole.name}`);
          setActiveConfigRole(null);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || "Failed to update permissions");
        },
      }
    );
  };

  const handleCreateRole = () => {
    const roleName = prompt("Enter new role title (e.g. Security Auditor):");
    if (!roleName || !roleName.trim()) return;

    const trimmed = roleName.trim();
    const code = trimmed.toUpperCase().replace(/[^A-Z0-9_]/g, "_");

    createRoleMutation.mutate(
      {
        name: trimmed,
        code,
        description: `Custom ${trimmed} role permissions and access policies.`,
        permissions: [],
      },
      {
        onSuccess: () => toast.success(`Created role ${trimmed} (${code})`),
        onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to create custom role"),
      }
    );
  };

  const handleDeleteRole = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete role '${name}'?`)) return;
    deleteRoleMutation.mutate(id, {
      onSuccess: () => toast.success(`Role '${name}' deleted successfully`),
      onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Cannot delete role"),
    });
  };

  // Group all permissions by module
  const permissionsByModule = allPermissions.reduce((acc: Record<string, any[]>, perm: any) => {
    const mod = perm.module || "General";
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(perm);
    return acc;
  }, {});

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>Identity & Access Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Role-Based Access Control (RBAC)</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Configure system roles, granular authorization policies, and access scopes.</p>
        </div>

        <button 
          onClick={handleCreateRole}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Role</span>
        </button>
      </div>

      {/* Roles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rolesToDisplay.map((role: any, idx: number) => {
          const isWildcard = role.code === "SUPER_ADMIN";
          const count = isWildcard
            ? "ALL (Wildcard)"
            : role.permissionsCount || `${role.permissions?.length || 0} Scope Directives`;

          return (
            <div key={role._id || role.id || idx} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-[10px] font-extrabold font-mono uppercase tracking-widest">
                    {role.code || role.name}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-blue-500" /> Active Policy
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{role.name || role.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{role.description || "System RBAC access control group."}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 font-bold">{count}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenPermissionsModal(role)}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Key className="w-3 h-3" />
                    <span>Configure Permissions</span>
                  </button>
                  {role._id && !role.isDefault && (
                    <button
                      onClick={() => handleDeleteRole(role._id, role.name)}
                      className="p-1 rounded text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete custom role"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Configure Permissions Modal */}
      {activeConfigRole && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase">
                    {activeConfigRole.code || activeConfigRole.name}
                  </span>
                  <span className="text-xs text-slate-400">Policy Directives</span>
                </div>
                <h2 className="text-xl font-extrabold text-white">
                  Configure Permissions: {activeConfigRole.name}
                </h2>
              </div>
              <button
                onClick={() => setActiveConfigRole(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Permissions List */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {activeConfigRole.code === "SUPER_ADMIN" ? (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Super Administrator Wildcard Granted</span>
                  </div>
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    The SUPER_ADMIN role holds non-revocable wildcard authorization (<code>*.*</code>). All current and future API endpoints, database mutations, and administrative directives are universally authorized.
                  </p>
                </div>
              ) : null}

              {loadingPermissions ? (
                <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  <span>Loading system permission catalog...</span>
                </div>
              ) : Object.keys(permissionsByModule).length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  No permission items found in database catalog.
                </div>
              ) : (
                Object.entries(permissionsByModule).map(([moduleName, rawPermissions]) => {
                  const modulePermissions = (rawPermissions as any[]) || [];
                  const moduleIds = modulePermissions.map((p: any) => p._id);
                  const isAllSelected = moduleIds.length > 0 && moduleIds.every((id: string) => selectedPermissionIds.includes(id));

                  return (
                    <div key={moduleName} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                        <span className="font-extrabold text-sm text-indigo-400 uppercase tracking-wider">
                          {moduleName} Directives
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleModule(modulePermissions)}
                          className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors"
                        >
                          {isAllSelected ? "Deselect All" : "Select All"}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {modulePermissions.map((perm: any) => {
                          const isChecked = selectedPermissionIds.includes(perm._id);

                          return (
                            <label
                              key={perm._id}
                              onClick={() => handleTogglePermission(perm._id)}
                              className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                                isChecked
                                  ? "bg-blue-600/15 border-blue-500/40 text-white shadow-sm"
                                  : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700"
                              }`}
                            >
                              <div className="pt-0.5">
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 text-blue-400" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-600" />
                                )}
                              </div>
                              <div className="space-y-0.5">
                                <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                                  <span>{perm.name}</span>
                                </div>
                                <div className="font-mono text-[10px] text-slate-500 uppercase">{perm.code}</div>
                                {perm.description && (
                                  <p className="text-[11px] text-slate-400 leading-tight">{perm.description}</p>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                <strong className="text-white font-mono">{selectedPermissionIds.length}</strong> permissions active
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveConfigRole(null)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  disabled={updateRoleMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {updateRoleMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Directives...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Directives</span>
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

