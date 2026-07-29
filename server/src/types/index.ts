import { Request } from "express";

export interface IUserPayload {
  userId: string;
  email: string;
  role: string;
  permissions?: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: IUserPayload;
}
