import apiClient from './apiClient';
import authService from './auth';

const ratingsService = {
    /**
     * Enviar o actualizar calificación de un item
     * @param {number} id_item - ID del item a calificar
     * @param {number} puntuacion - Puntuación de 1 a 5 estrellas
     * @param {string} comentario - Comentario opcional
     * @returns {Promise<Object>} Respuesta del servidor
     */
    submitRating: async (id_item, puntuacion, comentario = '') => {
        try {
            const token = authService.getToken();

            if (!token) {
                throw new Error('Usuario no autenticado');
            }

            const response = await apiClient.post('/ratings',
                { id_item, puntuacion, comentario },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Obtener todas las calificaciones de un item
     * @param {number} id_item - ID del item
     * @returns {Promise<Object>} Calificaciones y estadísticas
     */
    getRatingsByItem: async (id_item) => {
        try {
            const response = await apiClient.get(`/ratings/item/${id_item}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Obtener la calificación del usuario actual para un item específico
     * @param {number} id_item - ID del item
     * @returns {Promise<Object>} Calificación del usuario o null
     */
    getUserRatingForItem: async (id_item) => {
        try {
            const token = authService.getToken();

            if (!token) {
                return { success: true, data: null };
            }

            const response = await apiClient.get(`/ratings/user/item/${id_item}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default ratingsService;
