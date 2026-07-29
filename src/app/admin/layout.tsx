import React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]} portalName="Admin Panel">
      <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 antialiased">
        {/* Dark Sidebar */}
        <AdminSidebar />

        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50/70 dark:bg-slate-950/70" data-lenis-prevent>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}