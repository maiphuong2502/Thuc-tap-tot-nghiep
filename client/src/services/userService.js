import axiosClient from '../api/axiosClient';

const userService = {
  list: () => axiosClient.get('/users'),

  create: (payload) =>
    axiosClient.post('/users', payload),

  update: (userId, payload) =>
    axiosClient.put(`/users/${userId}`, payload),

  remove: (userId) =>
    axiosClient.delete(`/users/${userId}`),
};

export default userService;

