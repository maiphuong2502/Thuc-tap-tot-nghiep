import axiosClient from '../api/axiosClient';

const speakingSubmissionService = {
  list: (params?: { user_id?: string; question_id?: string; has_score?: string; per_page?: number; page?: number }) => {
    return axiosClient.get('/speaking-submissions', { params });
  },
  getById: (id: string) => axiosClient.get(`/speaking-submissions/${id}`),
  create: (data: any) => axiosClient.post('/speaking-submissions', data),
  update: (id: string, data: any) => axiosClient.put(`/speaking-submissions/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/speaking-submissions/${id}`),
};

export default speakingSubmissionService;
