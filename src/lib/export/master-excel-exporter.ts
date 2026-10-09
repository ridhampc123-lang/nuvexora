import * as XLSX from "xlsx";
import { getMasterBackupSnapshot, downloadMasterExcelExport } from "@/lib/api/admin-api";
import { toast } from "sonner";

export async function executeMasterExcelExport() {
  const loadingToast = toast.loading("Generating Master Excel Workbook across all systems...");

  try {
    // Attempt direct server streaming first
    try {
      const blob = await downloadMasterExcelExport();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Nuvexora_Enterprise_Master_Export_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success("Master Excel Export downloaded successfully!");
      return;
    } catch {
      // Fallback to client-side compilation via snapshot
    }

    // Client-side fallback using snapshot
    const snapshot = await getMasterBackupSnapshot();
    if (!snapshot || !snapshot.collections) {
      throw new Error("Unable to retrieve system data snapshot");
    }

    const wb = XLSX.utils.book_new();
    const collections = snapshot.collections;

    const addSheet = (data: any[], sheetName: string) => {
      const sanitized = (data || []).map((row) => {
        const cleanRow: Record<string, any> = {};
        for (const [key, val] of Object.entries(row)) {
          if (key === "__v" || key === "password") continue;
          if (typeof val === "object" && val !== null) {
            cleanRow[key] = JSON.stringify(val);
          } else {
            cleanRow[key] = val;
          }
        }
        return cleanRow;
      });

      const ws =
        sanitized.length > 0
          ? XLSX.utils.json_to_sheet(sanitized)
          : XLSX.utils.aoa_to_sheet([["No records currently stored"]]);

      XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
    };

    addSheet(collections.leads, "Leads");
    addSheet(collections.clients, "Clients");
    addSheet(collections.projects, "Projects");
    addSheet(collections.tasks, "Tasks");
    addSheet(collections.employees, "Employees");
    addSheet(collections.invoices, "Invoices");
    addSheet(collections.payments, "Payments");
    addSheet(collections.proposals, "Proposals");
    addSheet(collections.contracts, "Contracts");
    addSheet(collections.meetings, "Meetings");
    addSheet(collections.messages, "Messages");
    addSheet(collections.pricing, "Pricing Plans");
    addSheet(collections.currencies, "Currencies");
    addSheet(collections.services, "Services");
    addSheet(collections.blogs, "Blogs");
    addSheet(collections.portfolio, "Portfolio");
    addSheet(collections.subscribers, "Subscribers");

    XLSX.writeFile(
      wb,
      `Nuvexora_Enterprise_Master_Export_${new Date().toISOString().slice(0, 10)}.xlsx`
    );

    toast.dismiss(loadingToast);
    toast.success("Master Excel Export generated and downloaded successfully!");
  } catch (error: any) {
    console.error("Master export failed", error);
    toast.dismiss(loadingToast);
    toast.error(error.message || "Failed to generate Master Excel Export");
  }
}

export async function executeEmergencyJsonBackup() {
  const loadingToast = toast.loading("Generating full emergency database backup...");
  try {
    const snapshot = await getMasterBackupSnapshot();
    if (!snapshot) {
      throw new Error("Failed to capture database snapshot");
    }

    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snapshot, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `nuvexora-emergency-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    toast.dismiss(loadingToast);
    toast.success("Emergency Backup Snapshot downloaded securely!");
  } catch (err: any) {
    console.error("Backup failed", err);
    toast.dismiss(loadingToast);
    toast.error(err.message || "Failed to generate emergency backup");
  }
}
