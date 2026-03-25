import axiosClient from '../api/axiosClient';

const testPartService = {
  list: (params: { search?: string; test_id?: string; skill_id?: string; per_page?: number; page?: number }) => {
    return axiosClient.get('/test-parts', { params });
  },
  getById: (id: string) => axiosClient.get(`/test-parts/${id}`),
  create: (data: any) => axiosClient.post('/test-parts', data),
  update: (id: string, data: any) => axiosClient.put(`/test-parts/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/test-parts/${id}`),
};

export default testPartService;
