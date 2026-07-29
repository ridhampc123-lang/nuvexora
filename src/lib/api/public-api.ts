import { apiClient } from "./api-client";

export const getPublicServices = async () => {
  try {
    const { data } = await apiClient.get("/services");
    return data.data;
  } catch {
    return [];
  }
};

export const getPublicBlogs = async () => {
  try {
    const { data } = await apiClient.get("/blogs");
    return data.data;
  } catch {
    return [];
  }
};

export const getPublicBlogBySlug = async (slug: string) => {
  const { data } = await apiClient.get(`/blogs/${slug}`);
  return data.data;
};

export const getPublicPortfolio = async () => {
  try {
    const { data } = await apiClient.get("/public/portfolio");
    return data.data;
  } catch {
    return [];
  }
};

export const getHomepageData = async () => {
  const { data } = await apiClient.get("/public/homepage");
  return data.data;
};

export const bookConsultationMeeting = async (payload: {
  organizerName: string;
  organizerEmail: string;
  companyName?: string;
  meetingDate: string;
  timeSlot: string;
  topic: string;
}) => {
  const { data } = await apiClient.post("/public/meetings/book", payload);
  return data.data;
};

export const subscribeNewsletter = async (email: string) => {
  const { data } = await apiClient.post("/public/newsletter/subscribe", { email });
  return data.data;
};
