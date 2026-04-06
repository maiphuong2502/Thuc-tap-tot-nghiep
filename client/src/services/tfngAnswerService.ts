import axiosClient from '../api/axiosClient';
import { TfngAnswerFormData } from '../types/tfng-answer';

const tfngAnswerService = {
  list: () => axiosClient.get('/tfng-answers'),
  getById: (id: string) => axiosClient.get(`/tfng-answers/${id}`),
  create: (data: TfngAnswerFormData) =>
    axiosClient.post('/tfng-answers', data),
  update: (id: string, data: Partial<TfngAnswerFormData>) =>
    axiosClient.put(`/tfng-answers/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/tfng-answers/${id}`),
};

export default tfngAnswerService;
