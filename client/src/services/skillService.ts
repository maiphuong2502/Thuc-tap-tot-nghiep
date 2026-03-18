import axiosClient from '../api/axiosClient';

const skillService = {
  list: () => axiosClient.get('/skills'),
};

export default skillService;


