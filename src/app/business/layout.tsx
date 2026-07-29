import React from "react";
import { BusinessSidebar } from "@/components/business/business-sidebar";
import { BusinessHeader } from "@/components/business/business-header";

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 antialiased">
      <BusinessSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <BusinessHeader />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50/70 dark:bg-slate-950/70" data-lenis-prevent>
          {children}
        </main>
      </div>
    </div>
  );
}
