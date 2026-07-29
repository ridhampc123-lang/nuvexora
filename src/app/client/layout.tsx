import React from "react";
import { ClientSidebar } from "@/components/client/client-sidebar";
import { ClientHeader } from "@/components/client/client-header";
import { SocketProvider } from "@/providers/socket-provider";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["CLIENT", "SUPER_ADMIN", "ADMIN"]} portalName="Client Workspace">
      <SocketProvider>
        <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 antialiased">
          {/* Sidebar */}
          <ClientSidebar />

          {/* Main Workspace Pane */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <ClientHeader />
            <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50/70 dark:bg-slate-950/70" data-lenis-prevent>
              {children}
            </main>
          </div>
        </div>
      </SocketProvider>
    </AuthGuard>
  );
}