import axiosClient from '../api/axiosClient';

const topicService = {
  list: () => axiosClient.get('/topics'),
  create: (data: any) => axiosClient.post('/topics', data),
  update: (id: number, data: any) => axiosClient.put(`/topics/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/topics/${id}`),
};

export default topicService;
