import axiosClient from '../api/axiosClient';

const mcqQuestionService = {
  list: () => axiosClient.get('/mcq-questions'),
  getById: (id: string) => axiosClient.get(`/mcq-questions/${id}`),
  create: (data: any) => axiosClient.post('/mcq-questions', data),
  update: (id: string, data: any) => axiosClient.put(`/mcq-questions/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/mcq-questions/${id}`),
};

export default mcqQuestionService;
