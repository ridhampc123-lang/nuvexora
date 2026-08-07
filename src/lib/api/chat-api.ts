import { apiClient } from "./api-client";

export interface IChatMessageItem {
  _id: string;
  channelId: string;
  senderId?: string;
  senderName: string;
  senderRole: string;
  text: string;
  attachmentName?: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface SendChatMessageInput {
  channelId: string;
  senderId?: string;
  senderName: string;
  senderRole: string;
  text: string;
  attachmentName?: string;
  attachmentUrl?: string;
}

export const getChannelMessages = async (channelId: string): Promise<IChatMessageItem[]> => {
  const response = await apiClient.get(`/chat/messages?channelId=${encodeURIComponent(channelId)}`);
  return response.data.data;
};

export const sendChatMessageApi = async (input: SendChatMessageInput): Promise<IChatMessageItem> => {
  const response = await apiClient.post("/chat/messages", input);
  return response.data.data;
};

export const getChatChannelsApi = async () => {
  const response = await apiClient.get("/chat/channels");
  return response.data.data;
};

export const getAssignedTeamMembersApi = async () => {
  const response = await apiClient.get("/chat/team-members");
  return response.data.data;
};

