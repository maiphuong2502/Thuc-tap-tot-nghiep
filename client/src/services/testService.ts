import axiosClient from '../api/axiosClient';

const testService = {
  list: (keyword = '') => {
    return axiosClient.get('/tests', { params: { keyword } });
  },
  create: (data: any) => axiosClient.post('/tests', data),
  update: (id: string, data: any) => axiosClient.put(`/tests/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/tests/${id}`),
};

export default testService;