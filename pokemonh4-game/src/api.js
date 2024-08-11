import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001/api',
});

export const login = (credentials) => API.post('/login', credentials);
export const register = (userData) => API.post('/register', userData);
export const fetchUserInfo = (token) => API.get('/me', {
    headers: {
        'Authorization': `Bearer ${token}`,
    },
});
