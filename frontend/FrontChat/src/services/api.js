import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // URL padrão do Spring Boot
});

// Interceptador para adicionar o token JWT em todas as requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    register: async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
    updateProfile: async (data) => {
        const response = await api.put('/auth/profile', data);
        if (response.data) {
            // Atualizar o usuário no localStorage para refletir as mudanças (exceto token/senha)
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export default api;
