import axiosClient from '../api/axiosClient';
import { TfngQuestionFormData } from '../types/tfng-question';

const tfngQuestionService = {
  list: () => axiosClient.get('/tfng-questions'),
  getById: (id: string) => axiosClient.get(`/tfng-questions/${id}`),
  create: (data: TfngQuestionFormData) =>
    axiosClient.post('/tfng-questions', data),
  update: (id: string, data: Partial<TfngQuestionFormData>) =>
    axiosClient.put(`/tfng-questions/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/tfng-questions/${id}`),
};

export default tfngQuestionService;
