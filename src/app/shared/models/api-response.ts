export interface ApiResponse {
  id: number | null;
  isSuccess: boolean;
  statusCode: number;
  info: any;
  data: any;
  errors: any;
  totalPages: number;
  totalRecordCount: number;
  totalPageCount: number;
}
