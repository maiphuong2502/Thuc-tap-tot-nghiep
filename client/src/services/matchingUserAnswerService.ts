import axiosClient from '../api/axiosClient';

const matchingUserAnswerService = {
  list: (params?: any) => axiosClient.get('/matching-user-answers', { params }),
  getById: (id: string) => axiosClient.get(`/matching-user-answers/${id}`),
  create: (data: any) => axiosClient.post('/matching-user-answers', data),
  update: (id: string, data: any) => axiosClient.put(`/matching-user-answers/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/matching-user-answers/${id}`),
};

export default matchingUserAnswerService;
