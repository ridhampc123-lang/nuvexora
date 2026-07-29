import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHomepageData, bookConsultationMeeting, subscribeNewsletter, getPublicBlogs, getPublicPortfolio } from "@/lib/api/public-api";
import { 
  getAdminMetrics, 
  getAdminUsers, 
  updateAdminUser, 
  getAdminLeads, 
  updateAdminLeadStatus,
  getAdminClients,
  createAdminClient,
  updateAdminClient,
  getAdminClientById,
  getAdminEmployees,
  createAdminEmployee,
  updateAdminEmployee,
  getAdminEmployeeById,
  getAdminDepartments,
  createAdminDepartment,
  updateAdminDepartment,
  deleteAdminDepartment,
  getAdminAttendance,
  createAdminAttendance,
  updateAdminAttendance,
  deleteAdminAttendance,
  getAdminLeaveRequests,
  createAdminLeaveRequest,
  updateAdminLeaveRequest,
  deleteAdminLeaveRequest,
  getAdminTasks,
  createAdminTask,
  updateAdminTask,
  deleteAdminTask,
  getAdminProjects,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
  getAdminMilestones,
  createAdminMilestone,
  updateAdminMilestone,
  deleteAdminMilestone,
  getAdminInvoices,
  createAdminInvoice,
  updateAdminInvoice,
  deleteAdminInvoice,
  getAdminPayments,
  createAdminPayment,
  updateAdminPayment,
  deleteAdminPayment,
  getAdminProposals,
  createAdminProposal,
  updateAdminProposal,
  deleteAdminProposal,
  getAdminContracts,
  createAdminContract,
  updateAdminContract,
  deleteAdminContract,
  getAdminMessages,
  updateAdminMessageStatus,
  deleteAdminMessage,
  getAdminMeetings,
  createAdminMeeting,
  updateAdminMeeting,
  deleteAdminMeeting,
  getAdminTickets,
  updateAdminTicket,
  deleteAdminTicket
} from "@/lib/api/admin-api";
import { 
  getClientDashboard, 
  getClientProjects, 
  getClientTasks, 
  updateClientTaskStatus, 
  getClientInvoices, 
  payClientInvoice,
  getClientApprovals,
  approveDeliverable,
  requestDeliverableChanges,
  getClientTickets,
  createSupportTicket
} from "@/lib/api/client-api";

export const useHomepageQuery = () => {
  return useQuery({
    queryKey: ["homepage"],
    queryFn: getHomepageData,
  });
};

export const usePublicBlogsQuery = () => {
  return useQuery({
    queryKey: ["publicBlogs"],
    queryFn: getPublicBlogs,
  });
};

export const usePublicPortfolioQuery = () => {
  return useQuery({
    queryKey: ["publicPortfolio"],
    queryFn: getPublicPortfolio,
  });
};

// --- ADMIN HOOKS ---

export const useAdminMetricsQuery = () => {
  return useQuery({
    queryKey: ["adminMetrics"],
    queryFn: getAdminMetrics,
  });
};

export const useAdminUsersQuery = () => {
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: getAdminUsers,
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useAdminLeadsQuery = () => {
  return useQuery({
    queryKey: ["adminLeads"],
    queryFn: getAdminLeads,
  });
};

export const useUpdateLeadStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminLeadStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLeads"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};



export const useAdminClientsQuery = () => {
  return useQuery({
    queryKey: ["adminClients"],
    queryFn: getAdminClients,
  });
};

export const useAdminClientByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["adminClients", id],
    queryFn: () => getAdminClientById(id),
    enabled: !!id,
  });
};

export const useCreateAdminClientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminClients"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useUpdateAdminClientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminClient,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminClients"] });
      queryClient.invalidateQueries({ queryKey: ["adminClients", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useAdminEmployeesQuery = () => {
  return useQuery({
    queryKey: ["adminEmployees"],
    queryFn: getAdminEmployees,
  });
};

export const useAdminEmployeeByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["adminEmployees", id],
    queryFn: () => getAdminEmployeeById(id),
    enabled: !!id,
  });
};

export const useCreateAdminEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEmployees"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useUpdateAdminEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminEmployee,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminEmployees"] });
      queryClient.invalidateQueries({ queryKey: ["adminEmployees", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useAdminDepartmentsQuery = () => {
  return useQuery({
    queryKey: ["adminDepartments"],
    queryFn: getAdminDepartments,
  });
};

export const useCreateAdminDepartmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDepartments"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useUpdateAdminDepartmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDepartments"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useDeleteAdminDepartmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDepartments"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useAdminAttendanceQuery = () => {
  return useQuery({
    queryKey: ["adminAttendance"],
    queryFn: getAdminAttendance,
  });
};

export const useCreateAdminAttendanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAttendance"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useUpdateAdminAttendanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAttendance"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useDeleteAdminAttendanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAttendance"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useAdminLeaveRequestsQuery = () => {
  return useQuery({
    queryKey: ["adminLeaveRequests"],
    queryFn: getAdminLeaveRequests,
  });
};

export const useCreateAdminLeaveRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminLeaveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLeaveRequests"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useUpdateAdminLeaveRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminLeaveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLeaveRequests"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useDeleteAdminLeaveRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminLeaveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLeaveRequests"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useAdminTasksQuery = () => {
  return useQuery({
    queryKey: ["adminTasks"],
    queryFn: getAdminTasks,
  });
};

export const useCreateAdminTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTasks"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useUpdateAdminTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTasks"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useDeleteAdminTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTasks"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useAdminProjectsQuery = () => {
  return useQuery({
    queryKey: ["adminProjects"],
    queryFn: getAdminProjects,
  });
};

export const useCreateAdminProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProjects"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useUpdateAdminProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProjects"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useDeleteAdminProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProjects"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useAdminMilestonesQuery = () => {
  return useQuery({
    queryKey: ["adminMilestones"],
    queryFn: getAdminMilestones,
  });
};

export const useCreateAdminMilestoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminMilestone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMilestones"] });
      queryClient.invalidateQueries({ queryKey: ["adminProjects"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useUpdateAdminMilestoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminMilestone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMilestones"] });
      queryClient.invalidateQueries({ queryKey: ["adminProjects"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

export const useDeleteAdminMilestoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, projectId }: { id: string, projectId: string }) => deleteAdminMilestone(id, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMilestones"] });
      queryClient.invalidateQueries({ queryKey: ["adminProjects"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

// --- INVOICE HOOKS ---
export const useAdminInvoicesQuery = () => {
  return useQuery({
    queryKey: ["adminInvoices"],
    queryFn: getAdminInvoices,
  });
};
export const useCreateAdminInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminInvoices"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};
export const useUpdateAdminInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminInvoices"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};
export const useDeleteAdminInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminInvoices"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

// --- PAYMENT HOOKS ---
export const useAdminPaymentsQuery = () => {
  return useQuery({
    queryKey: ["adminPayments"],
    queryFn: getAdminPayments,
  });
};
export const useCreateAdminPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPayments"] });
      queryClient.invalidateQueries({ queryKey: ["adminInvoices"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};
export const useUpdateAdminPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPayments"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};
export const useDeleteAdminPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPayments"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

// --- PROPOSAL HOOKS ---
export const useAdminProposalsQuery = () => {
  return useQuery({
    queryKey: ["adminProposals"],
    queryFn: getAdminProposals,
  });
};
export const useCreateAdminProposalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProposals"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};
export const useUpdateAdminProposalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProposals"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};
export const useDeleteAdminProposalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProposals"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

// --- CONTRACT HOOKS ---
export const useAdminContractsQuery = () => {
  return useQuery({
    queryKey: ["adminContracts"],
    queryFn: getAdminContracts,
  });
};
export const useCreateAdminContractMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminContracts"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};
export const useUpdateAdminContractMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminContracts"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};
export const useDeleteAdminContractMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminContracts"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

// --- MESSAGE HOOKS ---
export const useAdminMessagesQuery = () => {
  return useQuery({
    queryKey: ["adminMessages"],
    queryFn: getAdminMessages,
  });
};
export const useUpdateAdminMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminMessageStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMessages"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};
export const useDeleteAdminMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMessages"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

// --- MEETING HOOKS ---
export const useAdminMeetingsQuery = () => {
  return useQuery({
    queryKey: ["adminMeetings"],
    queryFn: getAdminMeetings,
  });
};
export const useCreateAdminMeetingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMeetings"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};
export const useUpdateAdminMeetingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMeetings"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};
export const useDeleteAdminMeetingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMeetings"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

// --- TICKET HOOKS ---
export const useAdminTicketsQuery = () => {
  return useQuery({
    queryKey: ["adminTickets"],
    queryFn: getAdminTickets,
  });
};
export const useUpdateAdminTicketMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTickets"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};
export const useDeleteAdminTicketMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTickets"] });
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    },
  });
};

// --- CLIENT HOOKS ---

export const useClientDashboardQuery = () => {
  return useQuery({
    queryKey: ["clientDashboard"],
    queryFn: getClientDashboard,
  });
};

export const useClientProjectsQuery = () => {
  return useQuery({
    queryKey: ["clientProjects"],
    queryFn: getClientProjects,
  });
};

export const useClientTasksQuery = () => {
  return useQuery({
    queryKey: ["clientTasks"],
    queryFn: getClientTasks,
  });
};

export const useUpdateClientTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateClientTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientTasks"] });
      queryClient.invalidateQueries({ queryKey: ["clientDashboard"] });
    },
  });
};

export const useClientInvoicesQuery = () => {
  return useQuery({
    queryKey: ["clientInvoices"],
    queryFn: getClientInvoices,
  });
};

export const usePayInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: payClientInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientInvoices"] });
      queryClient.invalidateQueries({ queryKey: ["clientDashboard"] });
    },
  });
};

export const useClientApprovalsQuery = () => {
  return useQuery({
    queryKey: ["clientApprovals"],
    queryFn: getClientApprovals,
  });
};

export const useApproveDeliverableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveDeliverable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientApprovals"] });
      queryClient.invalidateQueries({ queryKey: ["clientDashboard"] });
    },
  });
};

export const useRequestChangesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestDeliverableChanges,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientApprovals"] });
      queryClient.invalidateQueries({ queryKey: ["clientDashboard"] });
    },
  });
};

export const useClientTicketsQuery = () => {
  return useQuery({
    queryKey: ["clientTickets"],
    queryFn: getClientTickets,
  });
};

export const useCreateTicketMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupportTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientTickets"] });
      queryClient.invalidateQueries({ queryKey: ["clientDashboard"] });
    },
  });
};

// --- PUBLIC MUTATIONS ---

export const useBookMeetingMutation = () => {
  return useMutation({
    mutationFn: bookConsultationMeeting,
  });
};

export const useSubscribeNewsletterMutation = () => {
  return useMutation({
    mutationFn: subscribeNewsletter,
  });
};

