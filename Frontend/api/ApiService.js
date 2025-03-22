import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { get200, get201 } from './utils/responseCodes.js';
import { getRestAPIUrl } from './utils/getRestAPIUrl.js';

export default class ApiService {
    static async sendRequest(service, method, controller, endpoint, token, data = null, params = null) {

        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method,
            url: `${getRestAPIUrl(service)}/${controller}/${endpoint}`,
            headers,
            data: data ? JSON.stringify(data) : null,
            params,
        };

        try {
            const response = await axios(options);

            if (
                (method === 'post' || method === 'put') &&
                response.status === get201().Code &&
                response.statusText === get201().Message
            ) {
                return response;
            } else if (
                (method === 'get' || method === 'delete') &&
                response.status === get200().Code &&
                response.statusText === get200().Message
            ) {
                return response;
            }
        } catch (error) {
            if (error.response?.status === 401) {
                console.warn('Unauthorized: clearing session');
                secureLocalStorage.removeItem('token');
                secureLocalStorage.removeItem('auth');
                window.location.href = '/login';
            }

            console.error(`Error in ${endpoint}:`, error.response?.data?.Message || error.message);
            return null;
        }


        return null;
    }
}
