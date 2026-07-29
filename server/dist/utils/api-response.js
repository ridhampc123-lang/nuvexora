"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    statusCode;
    success;
    message;
    data;
    pagination;
    errors;
    constructor(statusCode, data, message = "Success", pagination, errors = []) {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
        this.pagination = pagination;
        this.errors = errors;
    }
}
exports.ApiResponse = ApiResponse;
