import axiosClient from '../api/axiosClient';
import { MatchingQuestionFormData } from '../types/matching-question';

const matchingQuestionService = {
  list: () => axiosClient.get('/matching-questions'),
  getById: (id: string) => axiosClient.get(`/matching-questions/${id}`),
  create: (data: MatchingQuestionFormData) =>
    axiosClient.post('/matching-questions', data),
  update: (id: string, data: Partial<MatchingQuestionFormData>) =>
    axiosClient.put(`/matching-questions/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/matching-questions/${id}`),
};

export default matchingQuestionService;
