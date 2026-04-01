import axios from 'axios';

const API_URL = 'http://localhost:8000/api/fill-questions';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const fillQuestionService = {
    list: async () => {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    },

    getById: async (id: string) => {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    },

    create: async (data: any) => {
        const response = await axios.post(API_URL, data, getAuthHeaders());
        return response.data;
    },

    update: async (id: string, data: any) => {
        const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
        return response.data;
    },

    delete: async (id: string) => {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    }
};

export default fillQuestionService;
