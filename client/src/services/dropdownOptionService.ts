import axiosClient from '../api/axiosClient';
import { DropdownOptionFormData } from '../types/dropdown-option';

const dropdownOptionService = {
  list: () => axiosClient.get('/dropdown-options'),
  getById: (id: string) => axiosClient.get(`/dropdown-options/${id}`),
  create: (data: DropdownOptionFormData) =>
    axiosClient.post('/dropdown-options', data),
  update: (id: string, data: Partial<DropdownOptionFormData>) =>
    axiosClient.put(`/dropdown-options/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/dropdown-options/${id}`),
};

export default dropdownOptionService;
