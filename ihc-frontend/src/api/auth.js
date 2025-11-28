import apiClient from './apiClient';

const authService = {
    /**
     * Registrar un nuevo usuario
     * @param {string} nombre - Nombre del usuario
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @param {string} rol - Rol del usuario ('admin' o 'cliente')
     * @returns {Promise<Object>} Datos del usuario registrado
     */
    register: async (nombre, email, password, rol = 'cliente') => {
        try {
            const response = await apiClient.post('/auth/register', {
                nombre,
                email,
                password,
                rol
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Iniciar sesión
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<Object>} Token y datos del usuario
     */
    login: async (email, password) => {
        try {
            const response = await apiClient.post('/auth/login', {
                email,
                password
            });

            // Guardar token en localStorage
            if (response.data.success && response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Cerrar sesión
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    /**
     * Obtener usuario actual desde localStorage
     * @returns {Object|null} Datos del usuario o null si no está autenticado
     */
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Obtener token actual desde localStorage
     * @returns {string|null} Token o null si no está autenticado
     */
    getToken: () => {
        return localStorage.getItem('token');
    },

    /**
     * Verificar si el usuario está autenticado
     * @returns {boolean} true si está autenticado, false si no
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default authService;
