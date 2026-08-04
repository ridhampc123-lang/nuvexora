import { apiClient } from "./api-client";

export const getBusinessDeals = async () => {
  try {
    const { data } = await apiClient.get("/business/crm/deals");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const createBusinessDeal = async (dealData: any) => {
  const { data } = await apiClient.post("/business/crm/deals", dealData);
  return data.data;
};

export const updateBusinessDealStatus = async ({ id, stage, probability }: { id: string; stage: string; probability: number }) => {
  const { data } = await apiClient.patch(`/business/crm/deals/${id}`, { stage, probability });
  return data.data;
};

export const getBusinessEmployees = async () => {
  try {
    const { data } = await apiClient.get("/business/hr/employees");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const getBusinessTickets = async () => {
  try {
    const { data } = await apiClient.get("/business/support/tickets");
    if (Array.isArray(data.data)) return data.data;
  } catch {}
  return [];
};

export const getBusinessFinanceLedger = async () => {
  try {
    const { data } = await apiClient.get("/business/finance/ledger");
    return data.data;
  } catch {}
  return null;
};
