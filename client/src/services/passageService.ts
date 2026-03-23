import axiosClient from '../api/axiosClient';

const passageService = {
  list: () => axiosClient.get('/passages'),
  create: (data: any) => axiosClient.post('/passages', data),
  update: (id: string, data: any) => axiosClient.put(`/passages/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/passages/${id}`),
};

export default passageService;
