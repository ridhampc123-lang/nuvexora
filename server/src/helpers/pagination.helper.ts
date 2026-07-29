import { IPagination } from "../utils/api-response.js";

export const getPagination = (
  pageParam: any,
  limitParam: any,
  totalCount: number
): { skip: number; limit: number; pagination: IPagination } => {
  const page = Math.max(1, parseInt(pageParam as string, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(limitParam as string, 10) || 10));
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    skip,
    limit,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages,
    },
  };
};
