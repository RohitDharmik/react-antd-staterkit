import api from '../api';
import Swal from 'sweetalert2';

export const apiMiddleware = {
    get: async (url, config = {}) => {
        try {
            const response = await api.get(url, config);
            return { data: response.data, error: null };
        } catch (error) {
            Swal.fire('Error', error.response?.data || error.message, 'error');
            return { data: null, error: error.response?.data || error.message };
        }
    },

    post: async (url, data = {}, config = {}) => {
        try {
            const response = await api.post(url, data, config);
            return { data: response.data, error: null };
        } catch (error) {
            Swal.fire('Error', error.response?.data || error.message, 'error');
            return { data: null, error: error.response?.data || error.message };
        }
    },

    put: async (url, data = {}, config = {}) => {
        try {
            const response = await api.put(url, data, config);
            return { data: response.data, error: null };
        } catch (error) {
            Swal.fire('Error', error.response?.data || error.message, 'error');
            return { data: null, error: error.response?.data || error.message };
        }
    },

    delete: async (url, config = {}) => {
        try {
            const response = await api.delete(url, config);
            return { data: response.data, error: null };
        } catch (error) {
            Swal.fire('Error', error.response?.data || error.message, 'error');
            return { data: null, error: error.response?.data || error.message };
        }
    }
};