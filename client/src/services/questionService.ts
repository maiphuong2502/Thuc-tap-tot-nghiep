import axiosClient from '../api/axiosClient';

const questionService = {
  list: (params?: { skill?: string; type?: string; group?: string; per_page?: number; page?: number }) => {
    return axiosClient.get('/questions', { params });
  },
  getById: (id: string) => axiosClient.get(`/questions/${id}`),
  create: (data: any) => axiosClient.post('/questions', data),
  update: (id: string, data: any) => axiosClient.put(`/questions/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/questions/${id}`),
};

export default questionService;
