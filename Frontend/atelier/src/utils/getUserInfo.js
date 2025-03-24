import ApiService from 'api/ApiService.js';

export const getUserInfo = async (token) => {
    const response = await ApiService.sendRequest('auth', 'get', 'auth', 'me', token);
    return response;
};