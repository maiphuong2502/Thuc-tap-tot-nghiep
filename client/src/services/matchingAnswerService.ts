import axiosClient from '../api/axiosClient';
import { MatchingAnswerFormData } from '../types/matching-answer';

const matchingAnswerService = {
  list: () => axiosClient.get('/matching-answers'),
  getById: (id: string) => axiosClient.get(`/matching-answers/${id}`),
  create: (data: MatchingAnswerFormData) =>
    axiosClient.post('/matching-answers', data),
  update: (id: string, data: Partial<MatchingAnswerFormData>) =>
    axiosClient.put(`/matching-answers/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/matching-answers/${id}`),
};

export default matchingAnswerService;
