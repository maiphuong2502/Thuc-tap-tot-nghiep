import axiosClient from '../api/axiosClient';

const userExamService = {
  getExams: (params?: any) => axiosClient.get('/user/exams', { params }),
  getFullStructure: (id: string) => axiosClient.get(`/user/exams/${id}/full-structure`),
  getReviewData: (id: string) => axiosClient.get(`/results/${id}/review`),
  getResultDetail: (id: string) => axiosClient.get(`/results/${id}`),
  getMyResults: () => axiosClient.get('/my-results'),
};

export default userExamService;
