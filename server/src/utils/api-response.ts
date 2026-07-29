export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponse<T = any> {
  public statusCode: number;
  public success: boolean;
  public message: string;
  public data: T;
  public pagination?: IPagination;
  public errors: any[];

  constructor(
    statusCode: number,
    data: T,
    message: string = "Success",
    pagination?: IPagination,
    errors: any[] = []
  ) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.pagination = pagination;
    this.errors = errors;
  }
}
