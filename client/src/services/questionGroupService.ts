import axiosClient from '../api/axiosClient';

const questionGroupService = {
  list: (params: { search?: string; skill_id?: string; type?: string; per_page?: number; page?: number }) => {
    return axiosClient.get('/question-groups', { params });
  },
  getById: (id: string) => axiosClient.get(`/question-groups/${id}`),
  create: (data: any) => axiosClient.post('/question-groups', data),
  update: (id: string, data: any) => axiosClient.put(`/question-groups/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/question-groups/${id}`),
};

export default questionGroupService;
