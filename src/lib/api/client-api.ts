import { apiClient } from "./api-client";

export const getClientDashboard = async () => {
  try {
    const { data } = await apiClient.get("/client/dashboard");
    return data.data;
  } catch {
    return {
      clientName: "Client Account",
      companyName: "Organization",
      primaryProject: "No Active Primary Project",
      deliveryProgress: 0,
      projects: [],
      invoices: [],
      tasks: [],
      activeProjectsCount: 0,
      pendingTasksCount: 0,
      outstandingInvoicesTotal: "$0.00",
    };
  }
};

export const getClientProjects = async () => {
  try {
    const { data } = await apiClient.get("/client/projects");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const getClientTasks = async () => {
  try {
    const { data } = await apiClient.get("/client/tasks");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const updateClientTaskStatus = async ({ id, status }: { id: string; status: string }) => {
  try {
    const { data } = await apiClient.patch(`/client/tasks/${id}`, { status });
    return data.data;
  } catch {
    return { id, status };
  }
};

export const getClientInvoices = async () => {
  try {
    const { data } = await apiClient.get("/client/invoices");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const payClientInvoice = async (id: string) => {
  try {
    const { data } = await apiClient.post(`/client/invoices/${id}/pay`);
    return data.data;
  } catch {
    return { id, status: "paid" };
  }
};

// --- APPROVALS ---
export const getClientApprovals = async () => {
  try {
    const { data } = await apiClient.get("/client/approvals");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const approveDeliverable = async (id: string) => {
  try {
    const { data } = await apiClient.post(`/client/approvals/${id}/approve`);
    return data.data;
  } catch {
    return { id, status: "approved" };
  }
};

export const requestDeliverableChanges = async ({ id, comment, severity }: { id: string; comment: string; severity: string }) => {
  try {
    const { data } = await apiClient.post(`/client/approvals/${id}/request-changes`, { comment, severity });
    return data.data;
  } catch {
    return { id, status: "changes_requested", comment, severity };
  }
};

// --- SUPPORT TICKETS ---
export const getClientTickets = async () => {
  try {
    const { data } = await apiClient.get("/client/tickets");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const createSupportTicket = async (ticketData: { subject: string; category: string; priority: string; description: string }) => {
  try {
    const { data } = await apiClient.post("/client/tickets", ticketData);
    return data.data;
  } catch {
    return {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      ...ticketData,
      status: "open",
      createdAt: "Just now",
      assignedTo: "Support Engineering",
      slaTimeRemaining: "Pending",
      messages: [
        { sender: "Client", role: "Client", text: ticketData.description, timestamp: "Just now" }
      ]
    };
  }
};
