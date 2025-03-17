import axios from 'axios';
import { get200, get201 } from './utils/responseCodes.js';
import { getRestAPIUrl } from './utils/getRestAPIUrl.js';

export default class ApiService {
    static async sendRequest(method, endpoint, login, password, data = null, params = null) {
        const options = {
            method,
            url: `${getRestAPIUrl()}/Database/${endpoint}`,
            auth: { username: login, password: password },
            headers: { 'Content-Type': 'application/json' },
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
            console.error(`Error in ${endpoint}:`, error.response?.data?.Message || error.message);
            return error.response?.data?.Message || null;
        }
        return null;
    }
}
