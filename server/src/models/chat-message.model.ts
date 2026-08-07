import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  channelId: string;
  senderId?: string;
  senderName: string;
  senderRole: string;
  text: string;
  attachmentName?: string;
  attachmentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    channelId: { type: String, required: true, index: true },
    senderId: { type: String },
    senderName: { type: String, required: true },
    senderRole: { type: String, required: true },
    text: { type: String, required: true },
    attachmentName: { type: String },
    attachmentUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

export const ChatMessage = mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
