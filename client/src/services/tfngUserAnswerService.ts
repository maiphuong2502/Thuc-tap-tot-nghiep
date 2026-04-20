import axiosClient from '../api/axiosClient';

const tfngUserAnswerService = {
  list: (params?: any) => axiosClient.get('/tfng-user-answers', { params }),
  getById: (id: string) => axiosClient.get(`/tfng-user-answers/${id}`),
  create: (data: any) => axiosClient.post('/tfng-user-answers', data),
  update: (id: string, data: any) => axiosClient.put(`/tfng-user-answers/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/tfng-user-answers/${id}`),
};

export default tfngUserAnswerService;
