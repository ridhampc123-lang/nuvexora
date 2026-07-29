"use client";

import React, { useState } from "react";
import { useAdminEmployeesQuery, useCreateAdminEmployeeMutation } from "@/hooks/use-api-queries";
import { Container } from "@/components/ui/container";
import { Plus, Search, UserCircle2, Briefcase, Mail, Phone, Calendar as CalendarIcon, CheckCircle2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminEmployeeManagement() {
  const { data: employees, isLoading, isError } = useAdminEmployeesQuery();
  const createEmployee = useCreateAdminEmployeeMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "EMPLOYEE",
    designation: "",
    employmentType: "FULL_TIME",
    salary: 0,
    experience: "",
    skills: "",
    technologyStack: "",
    country: "",
    address: "",
    emergencyContact: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse comma-separated strings into arrays
    const formattedData = {
      ...formData,
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      technologyStack: formData.technologyStack.split(",").map(s => s.trim()).filter(Boolean),
    };

    createEmployee.mutate(formattedData, {
      onSuccess: () => {
        toast.success("Employee created successfully! Activation email has been sent.");
        setIsDrawerOpen(false);
        setFormData({
          name: "", email: "", phone: "", department: "", role: "EMPLOYEE", designation: "",
          employmentType: "FULL_TIME", salary: 0, experience: "", skills: "", technologyStack: "",
          country: "", address: "", emergencyContact: "", notes: ""
        });
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to create employee");
      }
    });
  };

  const filteredEmployees = employees?.filter((emp: any) => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Container size="large" className="py-8 animate-in fade-in zoom-in-95">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            Enterprise Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Manage employees, assign roles, and control system access.
          </p>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Onboard New Employee
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search employees by name, email, or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 dark:text-white transition-all shadow-sm"
        />
      </div>

      {/* Employee Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-64 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-3xl border border-slate-200 dark:border-slate-800"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-200 dark:border-rose-900 rounded-3xl">
          Failed to load employees. Please check your connection.
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <UserCircle2 className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Employees Found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery ? "No results match your search criteria." : "Start by onboarding your first employee to the system."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map((emp: any) => (
            <div key={emp._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 hover:shadow-xl hover:border-blue-500/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                  {emp.profileImage ? <img src={emp.profileImage} alt={emp.name} className="w-full h-full rounded-full object-cover" /> : emp.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">{emp.name}</h3>
                  <div className="text-[10px] font-bold text-blue-500 tracking-wider uppercase truncate">
                    {emp.designation}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{emp.department}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>Joined {new Date(emp.joiningDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  emp.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                  emp.status === 'on_leave' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                  'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                }`}>
                  {emp.status?.replace("_", " ") || "ACTIVE"}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{emp.employeeId}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Drawer for Creation */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-slate-950 shadow-2xl z-50 border-l border-slate-200 dark:border-slate-800 overflow-y-auto flex flex-col"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Onboard New Employee</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    This will automatically create a secure portal account and send an activation email.
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-6">
                
                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">1. Personal & Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Corporate Email *</label>
                      <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Country</label>
                      <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:border-blue-500 outline-none" />
                    </div>
                  </div>
                </div>

                {/* Section 2: Employment Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">2. Corporate Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Department *</label>
                      <input type="text" required placeholder="e.g. Engineering" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Designation / Title *</label>
                      <input type="text" required placeholder="e.g. Senior Frontend Eng" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">System Role *</label>
                      <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:border-blue-500 outline-none">
                        <option value="EMPLOYEE">Standard Employee</option>
                        <option value="MANAGER">Manager</option>
                        <option value="DEVELOPER">Developer</option>
                        <option value="DESIGNER">UI/UX Designer</option>
                        <option value="QA_ENGINEER">QA Engineer</option>
                        <option value="HR">Human Resources</option>
                        <option value="SALES">Sales</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Employment Type</label>
                      <select value={formData.employmentType} onChange={e => setFormData({...formData, employmentType: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:border-blue-500 outline-none">
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="INTERN">Intern</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Skills & Tech */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">3. Skills & Technologies</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Skills (Comma separated)</label>
                      <input type="text" placeholder="e.g. Project Management, Agile, Leadership" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Technology Stack (Comma separated)</label>
                      <input type="text" placeholder="e.g. React, Node.js, AWS, Figma" value={formData.technologyStack} onChange={e => setFormData({...formData, technologyStack: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:border-blue-500 outline-none" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-950 pb-6">
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={createEmployee.isPending} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2">
                    {createEmployee.isPending ? "Provisioning..." : "Onboard Employee & Send Welcome"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Container>
  );
}
