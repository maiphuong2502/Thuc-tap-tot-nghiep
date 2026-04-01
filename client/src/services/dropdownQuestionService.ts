import axiosClient from '../api/axiosClient';

const dropdownQuestionService = {
  list: () => axiosClient.get('/dropdown-questions'),
  getById: (id: string) => axiosClient.get(`/dropdown-questions/${id}`),
  create: (data: { question_id: string; content: string }) =>
    axiosClient.post('/dropdown-questions', data),
  update: (id: string, data: { content?: string }) =>
    axiosClient.put(`/dropdown-questions/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/dropdown-questions/${id}`),
};

export default dropdownQuestionService;
