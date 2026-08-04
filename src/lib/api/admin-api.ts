import { apiClient } from "./api-client"; // trigger hmr

// --- SERVICES ---
export const getAdminServices = async () => {
  try {
    const { data } = await apiClient.get("/services");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};
export const createAdminService = async (serviceData: any) => {
  const { data } = await apiClient.post("/services", serviceData);
  return data.data;
};
export const updateAdminService = async ({ id, ...serviceData }: { id: string; [key: string]: any }) => {
  const { data } = await apiClient.patch(`/services/${id}`, serviceData);
  return data.data;
};
export const deleteAdminService = async (id: string) => {
  const { data } = await apiClient.delete(`/services/${id}`);
  return data.data;
};


// --- MEDIA & UPLOAD ---
export const uploadAdminImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  
  try {
    const { data } = await apiClient.post("/admin/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data.data.url;
  } catch {
    // Client-side fallback: Convert file to Base64 Data URI and post as JSON
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Image = reader.result as string;
          const { data } = await apiClient.post("/admin/upload", { image: base64Image });
          resolve(data.data.url);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
};

// --- BLOGS ---
export const getAdminBlogs = async () => {
  try {
    const { data } = await apiClient.get("/admin/blogs");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};
export const createAdminBlog = async (blogData: any) => {
  const { data } = await apiClient.post("/admin/blogs", blogData);
  return data.data;
};
export const updateAdminBlog = async ({ id, ...blogData }: { id: string; [key: string]: any }) => {
  const { data } = await apiClient.patch(`/admin/blogs/${id}`, blogData);
  return data.data;
};
export const deleteAdminBlog = async (id: string) => {
  const { data } = await apiClient.delete(`/admin/blogs/${id}`);
  return data.data;
};

// --- PORTFOLIO ---
export const getAdminPortfolio = async () => {
  try {
    const { data } = await apiClient.get("/admin/portfolio");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};
export const createAdminPortfolio = async (portfolioData: any) => {
  const { data } = await apiClient.post("/admin/portfolio", portfolioData);
  return data.data;
};
export const updateAdminPortfolio = async ({ id, ...portfolioData }: { id: string; [key: string]: any }) => {
  const { data } = await apiClient.patch(`/admin/portfolio/${id}`, portfolioData);
  return data.data;
};
export const deleteAdminPortfolio = async (id: string) => {
  const { data } = await apiClient.delete(`/admin/portfolio/${id}`);
  return data.data;
};

export const getAdminMetrics = async () => {
  try {
    const { data } = await apiClient.get("/admin/metrics");
    return data.data;
  } catch {
    return {
      totalUsers: 0,
      totalLeads: 0,
      activeProjects: 0,
      totalBlogs: 0,
      upcomingMeetings: 0,
      systemHealth: "OPTIMAL",
    };
  }
};

export const getAdminUsers = async () => {
  try {
    const { data } = await apiClient.get("/admin/users");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const updateAdminUser = async ({ id, role, status }: { id: string; role?: string; status?: string }) => {
  try {
    const { data } = await apiClient.patch(`/admin/users/${id}`, { role, status });
    return data.data;
  } catch {
    return { id, role, status };
  }
};

export const getAdminLeads = async () => {
  try {
    const { data } = await apiClient.get("/admin/leads");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const updateAdminLeadStatus = async ({ id, status }: { id: string; status: string }) => {
  try {
    const { data } = await apiClient.patch(`/admin/leads/${id}`, { status });
    return data.data;
  } catch {
    return { id, status };
  }
};

export const deleteAdminLead = async (id: string) => {
  const { data } = await apiClient.delete(`/admin/leads/${id}`);
  return data.data;
};



export const getAdminClients = async () => {
  try {
    const { data } = await apiClient.get("/admin/clients");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const createAdminClient = async (clientData: any) => {
  try {
    const { data } = await apiClient.post("/admin/clients", clientData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create client");
  }
};

export const updateAdminClient = async ({ id, ...clientData }: { id: string; [key: string]: any }) => {
  try {
    const { data } = await apiClient.patch(`/admin/clients/${id}`, clientData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update client");
  }
};

export const deleteAdminClient = async (id: string) => {
  try {
    const { data } = await apiClient.delete(`/admin/clients/${id}`);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete client");
  }
};

export const getAdminClientById = async (id: string) => {
  try {
    const { data } = await apiClient.get(`/admin/clients/${id}`);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch client");
  }
};

export const getAdminEmployees = async () => {
  try {
    const { data } = await apiClient.get("/admin/employees");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const createAdminEmployee = async (employeeData: any) => {
  try {
    const { data } = await apiClient.post("/admin/employees", employeeData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create employee");
  }
};

export const updateAdminEmployee = async ({ id, ...employeeData }: { id: string; [key: string]: any }) => {
  try {
    const { data } = await apiClient.patch(`/admin/employees/${id}`, employeeData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update employee");
  }
};

export const deleteAdminEmployee = async (id: string) => {
  try {
    const { data } = await apiClient.delete(`/admin/employees/${id}`);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete employee");
  }
};

export const getAdminEmployeeById = async (id: string) => {
  try {
    const { data } = await apiClient.get(`/admin/employees/${id}`);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch employee");
  }
};

export const getAdminDepartments = async () => {
  try {
    const { data } = await apiClient.get("/admin/departments");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const createAdminDepartment = async (departmentData: any) => {
  try {
    const { data } = await apiClient.post("/admin/departments", departmentData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create department");
  }
};

export const updateAdminDepartment = async ({ id, ...departmentData }: { id: string; [key: string]: any }) => {
  try {
    const { data } = await apiClient.patch(`/admin/departments/${id}`, departmentData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update department");
  }
};

export const deleteAdminDepartment = async (id: string) => {
  try {
    const { data } = await apiClient.delete(`/admin/departments/${id}`);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete department");
  }
};

export const getAdminAttendance = async () => {
  try {
    const { data } = await apiClient.get("/admin/attendance");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const createAdminAttendance = async (attendanceData: any) => {
  try {
    const { data } = await apiClient.post("/admin/attendance", attendanceData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to log attendance");
  }
};

export const updateAdminAttendance = async ({ id, ...attendanceData }: { id: string; [key: string]: any }) => {
  try {
    const { data } = await apiClient.patch(`/admin/attendance/${id}`, attendanceData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update attendance");
  }
};

export const deleteAdminAttendance = async (id: string) => {
  try {
    const { data } = await apiClient.delete(`/admin/attendance/${id}`);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete attendance record");
  }
};

export const getAdminLeaveRequests = async () => {
  try {
    const { data } = await apiClient.get("/admin/leave");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const createAdminLeaveRequest = async (leaveData: any) => {
  try {
    const { data } = await apiClient.post("/admin/leave", leaveData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to submit leave request");
  }
};

export const updateAdminLeaveRequest = async ({ id, ...leaveData }: { id: string; [key: string]: any }) => {
  try {
    const { data } = await apiClient.patch(`/admin/leave/${id}`, leaveData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update leave request");
  }
};

export const deleteAdminLeaveRequest = async (id: string) => {
  try {
    const { data } = await apiClient.delete(`/admin/leave/${id}`);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete leave request");
  }
};

export const getAdminTasks = async () => {
  try {
    const { data } = await apiClient.get("/admin/tasks");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const createAdminTask = async (taskData: any) => {
  try {
    const { data } = await apiClient.post("/admin/tasks", taskData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create task");
  }
};

export const updateAdminTask = async ({ id, ...taskData }: { id: string; [key: string]: any }) => {
  try {
    const { data } = await apiClient.patch(`/admin/tasks/${id}`, taskData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update task");
  }
};

export const deleteAdminTask = async (id: string) => {
  try {
    const { data } = await apiClient.delete(`/admin/tasks/${id}`);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete task");
  }
};

export const getAdminProjects = async () => {
  try {
    const { data } = await apiClient.get("/admin/projects");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const createAdminProject = async (projectData: any) => {
  try {
    const { data } = await apiClient.post("/admin/projects", projectData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create project");
  }
};

export const updateAdminProject = async ({ id, ...projectData }: { id: string; [key: string]: any }) => {
  try {
    const { data } = await apiClient.patch(`/admin/projects/${id}`, projectData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update project");
  }
};

export const deleteAdminProject = async (id: string) => {
  try {
    const { data } = await apiClient.delete(`/admin/projects/${id}`);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete project");
  }
};

export const getAdminMilestones = async () => {
  try {
    const { data } = await apiClient.get("/admin/milestones");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const createAdminMilestone = async (milestoneData: any) => {
  try {
    const { data } = await apiClient.post("/admin/milestones", milestoneData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create milestone");
  }
};

export const updateAdminMilestone = async ({ id, ...milestoneData }: { id: string; [key: string]: any }) => {
  try {
    const { data } = await apiClient.patch(`/admin/milestones/${id}`, milestoneData);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update milestone");
  }
};

export const deleteAdminMilestone = async (id: string, projectId: string) => {
  try {
    const { data } = await apiClient.delete(`/admin/milestones/${id}?projectId=${projectId}`);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete milestone");
  }
};

// --- INVOICES ---
export const getAdminInvoices = async () => {
  try {
    const { data } = await apiClient.get("/admin/invoices");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};
export const createAdminInvoice = async (invoiceData: any) => {
  const { data } = await apiClient.post("/admin/invoices", invoiceData);
  return data.data;
};
export const updateAdminInvoice = async ({ id, ...invoiceData }: { id: string; [key: string]: any }) => {
  const { data } = await apiClient.patch(`/admin/invoices/${id}`, invoiceData);
  return data.data;
};
export const deleteAdminInvoice = async (id: string) => {
  const { data } = await apiClient.delete(`/admin/invoices/${id}`);
  return data.data;
};

// --- PAYMENTS ---
export const getAdminPayments = async () => {
  try {
    const { data } = await apiClient.get("/admin/payments");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};
export const createAdminPayment = async (paymentData: any) => {
  const { data } = await apiClient.post("/admin/payments", paymentData);
  return data.data;
};
export const updateAdminPayment = async ({ id, ...paymentData }: { id: string; [key: string]: any }) => {
  const { data } = await apiClient.patch(`/admin/payments/${id}`, paymentData);
  return data.data;
};
export const deleteAdminPayment = async (id: string) => {
  const { data } = await apiClient.delete(`/admin/payments/${id}`);
  return data.data;
};

// --- PROPOSALS ---
export const getAdminProposals = async () => {
  try {
    const { data } = await apiClient.get("/admin/proposals");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};
export const createAdminProposal = async (proposalData: any) => {
  const { data } = await apiClient.post("/admin/proposals", proposalData);
  return data.data;
};
export const updateAdminProposal = async ({ id, ...proposalData }: { id: string; [key: string]: any }) => {
  const { data } = await apiClient.patch(`/admin/proposals/${id}`, proposalData);
  return data.data;
};
export const deleteAdminProposal = async (id: string) => {
  const { data } = await apiClient.delete(`/admin/proposals/${id}`);
  return data.data;
};

// --- CONTRACTS ---
export const getAdminContracts = async () => {
  try {
    const { data } = await apiClient.get("/admin/contracts");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};
export const createAdminContract = async (contractData: any) => {
  const { data } = await apiClient.post("/admin/contracts", contractData);
  return data.data;
};
export const updateAdminContract = async ({ id, ...contractData }: { id: string; [key: string]: any }) => {
  const { data } = await apiClient.patch(`/admin/contracts/${id}`, contractData);
  return data.data;
};
export const deleteAdminContract = async (id: string) => {
  const { data } = await apiClient.delete(`/admin/contracts/${id}`);
  return data.data;
};

// --- MESSAGES (Contact Messages) ---
export const getAdminMessages = async () => {
  try {
    const { data } = await apiClient.get("/admin/messages");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};
export const updateAdminMessageStatus = async ({ id, ...messageData }: { id: string; [key: string]: any }) => {
  const { data } = await apiClient.patch(`/admin/messages/${id}`, messageData);
  return data.data;
};
export const deleteAdminMessage = async (id: string) => {
  const { data } = await apiClient.delete(`/admin/messages/${id}`);
  return data.data;
};

// --- MEETINGS ---
export const getAdminMeetings = async () => {
  try {
    const { data } = await apiClient.get("/admin/meetings");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};
export const createAdminMeeting = async (meetingData: any) => {
  const { data } = await apiClient.post("/admin/meetings", meetingData);
  return data.data;
};
export const updateAdminMeeting = async ({ id, ...meetingData }: { id: string; [key: string]: any }) => {
  const { data } = await apiClient.patch(`/admin/meetings/${id}`, meetingData);
  return data.data;
};
export const deleteAdminMeeting = async (id: string) => {
  const { data } = await apiClient.delete(`/admin/meetings/${id}`);
  return data.data;
};

// --- TICKETS ---
export const getAdminTickets = async () => {
  try {
    const { data } = await apiClient.get("/admin/tickets");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};
export const updateAdminTicket = async ({ id, ...ticketData }: { id: string; [key: string]: any }) => {
  const { data } = await apiClient.patch(`/admin/tickets/${id}`, ticketData);
  return data.data;
};
export const deleteAdminTicket = async (id: string) => {
  const { data } = await apiClient.delete(`/admin/tickets/${id}`);
  return data.data;
};

// --- AUDIT LOGS ---
export const getAdminAuditLogs = async () => {
  try {
    const { data } = await apiClient.get("/admin/audit-logs");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

// --- PERMISSIONS ---
export const getAdminPermissions = async () => {
  try {
    const { data } = await apiClient.get("/admin/permissions");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

// --- ROLES ---
export const getAdminRoles = async () => {
  try {
    const { data } = await apiClient.get("/admin/roles");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const createAdminRole = async (roleData: any) => {
  const { data } = await apiClient.post("/admin/roles", roleData);
  return data.data;
};

// --- MEDIA ---
export const getAdminMedia = async () => {
  try {
    const { data } = await apiClient.get("/admin/media");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const deleteAdminMedia = async (id: string) => {
  const { data } = await apiClient.delete(`/admin/media/${id}`);
  return data.data;
};

// --- CAREERS ---
export const getAdminCareers = async () => {
  try {
    const { data } = await apiClient.get("/admin/careers");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const createAdminCareer = async (careerData: any) => {
  const { data } = await apiClient.post("/admin/careers", careerData);
  return data.data;
};

export const updateAdminCareer = async ({ id, ...careerData }: { id: string; [key: string]: any }) => {
  const { data } = await apiClient.patch(`/admin/careers/${id}`, careerData);
  return data.data;
};

export const deleteAdminCareer = async (id: string) => {
  const { data } = await apiClient.delete(`/admin/careers/${id}`);
  return data.data;
};

// --- ANALYTICS ---
export const getAdminAnalytics = async () => {
  try {
    const { data } = await apiClient.get("/admin/analytics");
    return data.data;
  } catch {}
  return null;
};

// --- REPORTS ---
export const getAdminReports = async () => {
  try {
    const { data } = await apiClient.get("/admin/reports");
    return data.data;
  } catch {}
  return null;
};


