import axiosClient from "../api/axiosClient";
import { IAudio } from "../types/audio";

const audioService = {
  list: (search?: string) => {
    return axiosClient.get('/audios', { params: search ? { search } : {} });
  },
  create: (data: FormData) => {
    return axiosClient.post('/audios', data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
  update: (id: string, data: FormData) => {
    data.append('_method', 'PUT');
    return axiosClient.post(`/audios/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
  delete: (id: string) => {
    return axiosClient.delete(`/audios/${id}`);
  }
};

export default audioService;
