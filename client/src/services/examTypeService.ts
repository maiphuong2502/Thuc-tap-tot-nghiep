import axiosClient from '../api/axiosClient';

const examTypeService = {
  list: () => axiosClient.get('/exam-types'),
  create: (data: any) => axiosClient.post('/exam-types', data),
  update: (id: number, data: any) => axiosClient.put(`/exam-types/${id}`, data),
  remove: (id: number) => axiosClient.delete(`/exam-types/${id}`),
};

export default examTypeService;
