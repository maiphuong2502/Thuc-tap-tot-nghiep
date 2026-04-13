import axiosClient from '../api/axiosClient';

const writingSubmissionService = {
  list: (params?: { user_id?: string; question_id?: string; has_score?: string; per_page?: number; page?: number }) => {
    return axiosClient.get('/writing-submissions', { params });
  },
  getById: (id: string) => axiosClient.get(`/writing-submissions/${id}`),
  create: (data: any) => axiosClient.post('/writing-submissions', data),
  update: (id: string, data: any) => axiosClient.put(`/writing-submissions/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/writing-submissions/${id}`),
};

export default writingSubmissionService;
