import { apiClient } from "./api-client";

export const getEmployeeProjects = async () => {
  try {
    const { data } = await apiClient.get("/employee/my/projects");
    if (data.projects) return data.projects;
  } catch {}
  return [];
};

export const getEmployeeTasks = async () => {
  try {
    const { data } = await apiClient.get("/employee/my/tasks");
    if (data.tasks) return data.tasks;
  } catch {}
  return [];
};

export const getMyAttendance = async () => {
  const { data } = await apiClient.get("/employee/my/attendance");
  return data;
};

export const checkInEmployee = async () => {
  const { data } = await apiClient.post("/employee/my/check-in");
  return data;
};

export const checkOutEmployee = async () => {
  const { data } = await apiClient.post("/employee/my/check-out");
  return data;
};

export const getMyLeaveRequests = async () => {
  const { data } = await apiClient.get("/employee/my/leave-requests");
  return data.requests || [];
};

export const createEmployeeLeaveRequest = async (payload: { type: string; startDate: string; endDate: string; reason: string }) => {
  const { data } = await apiClient.post("/employee/my/leave-requests", payload);
  return data;
};

export const getEmployeeTickets = async () => {
  const { data } = await apiClient.get("/employee/my/tickets");
  return data.tickets || [];
};

export const getEmployeeFiles = async () => {
  const { data } = await apiClient.get("/employee/my/files");
  return data.files || [];
};

export const createEmployeeTicket = async (payload: { subject: string; category?: string; priority?: string; description: string }) => {
  const { data } = await apiClient.post("/employee/my/tickets", payload);
  return data;
};

export const changeUserPassword = async (payload: { currentPassword: string; newPassword: string }) => {
  const { data } = await apiClient.post("/auth/change-password", payload);
  return data;
};
