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
