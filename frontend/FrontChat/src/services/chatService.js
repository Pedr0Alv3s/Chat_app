import api from './api';

export const chatService = {
    // Listar salas que o usuário participa
    getRooms: async () => {
        const response = await api.get('/rooms/my');
        return response.data;
    },

    // Acessar uma sala específica (carrega histórico e participantes)
    accessRoom: async (salaId) => {
        const response = await api.get(`/rooms/${salaId}/access`);
        return response.data;
    },

    // Criar uma nova sala
    createRoom: async (name) => {
        const response = await api.post('/rooms/create', { name });
        return response.data;
    },

    // Convidar usuário para a sala
    inviteUser: async (salaId, userName) => {
        const response = await api.post(`/rooms/${salaId}/invite`, { name: userName });
        return response.data;
    }
};

export default chatService;
