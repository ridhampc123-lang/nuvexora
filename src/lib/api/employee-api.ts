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
