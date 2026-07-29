"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = (pageParam, limitParam, totalCount) => {
    const page = Math.max(1, parseInt(pageParam, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(limitParam, 10) || 10));
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
exports.getPagination = getPagination;
