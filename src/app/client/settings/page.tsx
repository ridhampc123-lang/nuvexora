"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useClientProfileQuery, useUpdateClientProfileMutation } from "@/hooks/use-api-queries";
import { toast } from "sonner";

export default function ClientSettingsPage() {
  const { user } = useAuth();
  const { data: clientData, isLoading } = useClientProfileQuery();
  const updateProfileMutation = useUpdateClientProfileMutation();

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    industry: "FinTech & Enterprise",
  });

  useEffect(() => {
    if (clientData) {
      setProfile({
        name: clientData.ownerName || clientData.name || user?.name || "",
        email: clientData.email || user?.email || "",
        company: clientData.companyName || clientData.company || user?.companyName || "",
        phone: clientData.phone || "",
        industry: clientData.industry || "FinTech & Enterprise",
      });
    } else if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        company: user.companyName || "",
      }));
    }
  }, [clientData, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    updateProfileMutation.mutate(
      {
        ownerName: profile.name,
        companyName: profile.company,
        phone: profile.phone,
        industry: profile.industry,
      },
      {
        onSuccess: () => {
          setSaved(true);
          toast.success("Client account profile updated successfully!");
          setTimeout(() => setSaved(false), 4000);
        },
        onError: (err: any) => {
          const msg = err.response?.data?.message || "Failed to update profile settings";
          setError(msg);
          toast.error(msg);
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Client Portal Account Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage contact metadata, notification preferences, and SLA account status.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-3xl p-8 shadow-sm space-y-6 text-xs">
        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Account profile updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Corporate Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
