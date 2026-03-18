export interface ISkill {
  id: number;
  skill_name: string;
  description: string | null;
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
