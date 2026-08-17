import axios from 'axios';

// ei file e backend API base URL set kora hoy, ar auth token automatically request header e attach kora hoy.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const api = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) clearSession();
        if (!error.response) {
            error.message = `Backend is unreachable at ${API_URL}. Start the backend and verify frontend/.env.`;
        }
        return Promise.reject(error);
    }
);

export const getStoredUser = () => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
};

export const getToken = () => localStorage.getItem('token');
export const getActiveMode = () => localStorage.getItem('activeMode') === 'donor' ? 'donor' : 'recipient';

export const setActiveMode = (mode) => {
    localStorage.setItem('activeMode', mode === 'donor' ? 'donor' : 'recipient');
    window.dispatchEvent(new Event('mode-changed'));
};

export const saveSession = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    window.dispatchEvent(new Event('session-changed'));
};

export const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('activeMode');
    window.dispatchEvent(new Event('session-changed'));
};

export default api;
