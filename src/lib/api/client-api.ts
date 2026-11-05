import { apiClient } from "./api-client";

export const getClientDashboard = async () => {
  const { data } = await apiClient.get("/client/dashboard");
  return data.data;
};

export const getClientProjects = async () => {
  const { data } = await apiClient.get("/client/projects");
  return Array.isArray(data.data) ? data.data : [];
};

export const getClientTasks = async () => {
  const { data } = await apiClient.get("/client/tasks");
  return Array.isArray(data.data) ? data.data : [];
};

export const updateClientTaskStatus = async ({ id, status }: { id: string; status: string }) => {
  const { data } = await apiClient.patch(`/client/tasks/${id}`, { status });
  return data.data;
};

export const getClientInvoices = async () => {
  const { data } = await apiClient.get("/client/invoices");
  return Array.isArray(data.data) ? data.data : [];
};

export const payClientInvoice = async (id: string) => {
  const { data } = await apiClient.post(`/client/invoices/${id}/pay`);
  return data.data;
};

// --- DELIVERABLE APPROVALS & STAGE GATES ---
export const getClientApprovals = async () => {
  const { data } = await apiClient.get("/client/approvals");
  return Array.isArray(data.data) ? data.data : [];
};

export const approveDeliverable = async (id: string) => {
  const { data } = await apiClient.post(`/client/approvals/${id}/approve`);
  return data.data;
};

export const requestDeliverableChanges = async ({ id, comment, severity }: { id: string; comment: string; severity: string }) => {
  const { data } = await apiClient.post(`/client/approvals/${id}/request-changes`, { comment, severity });
  return data.data;
};

// --- SUPPORT TICKETS ---
export const getClientTickets = async () => {
  const { data } = await apiClient.get("/client/tickets");
  return Array.isArray(data.data) ? data.data : [];
};

export const createSupportTicket = async (ticketData: { subject: string; category: string; priority: string; description: string }) => {
  const { data } = await apiClient.post("/client/tickets", ticketData);
  return data.data;
};

// --- MEETINGS ---
export const getClientMeetings = async () => {
  const { data } = await apiClient.get("/client/meetings");
  return Array.isArray(data.data) ? data.data : [];
};

export const scheduleClientMeeting = async (meetingData: { title: string; type?: string; meetingDate: string; timeSlot?: string; topic?: string }) => {
  const { data } = await apiClient.post("/client/meetings", meetingData);
  return data.data;
};

// --- CLIENT PROFILE ---
export const getClientProfile = async () => {
  const { data } = await apiClient.get("/client/profile");
  return data.data;
};

export const updateClientProfile = async (profileData: { companyName?: string; ownerName?: string; phone?: string; industry?: string }) => {
  const { data } = await apiClient.put("/client/profile", profileData);
  return data.data;
};
