export interface ISkill {
  id: string;
  skill_name: string;
  description: string | null;
  time_limit?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
