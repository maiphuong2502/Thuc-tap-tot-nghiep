import axiosClient from '../api/axiosClient';

const topicService = {
  list: () => axiosClient.get('/topics'),
  create: (data: any) => axiosClient.post('/topics', data),
  update: (id: string, data: any) => axiosClient.put(`/topics/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/topics/${id}`),
};

export default topicService;
