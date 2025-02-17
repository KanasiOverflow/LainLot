import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { get200, get201 } from '../utils/responseCodes';
import { getRestAPIUrl } from '../utils/getRestAPIUrl';

export default class UserOrderHistoryService {

    static async GetUserOrderHistoryCount() {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetUserOrderHistoryCount`,
            auth: {
                username: secureLocalStorage.getItem('login'),
                password: secureLocalStorage.getItem('password')
            }
        };

        const response = await axios(options);
        if (response.status === get200().Code && response.statusText === get200().Message) {
            return response;
        }
        return null;
    };

    static async GetUserOrderHistoryFields() {
        
        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetUserOrderHistoryFields`,
            auth: {
                username: secureLocalStorage.getItem('login'),
                password: secureLocalStorage.getItem('password')
            }
        };
        const response = await axios(options);
        if (response.status === get200().Code && response.statusText === get200().Message) {
            return response;
        }
        return null;
    };

    static async GetUserOrderHistory(limit, page) {
        
        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetUserOrderHistory?limit=${limit}&page=${page}`,
            auth: {
                username: secureLocalStorage.getItem('login'),
                password: secureLocalStorage.getItem('password')
            }
        };
        const response = await axios(options);
        if (response.status === get200().Code && response.statusText === get200().Message) {
            return response;
        }
        return null;
    };

    static async GetUserOrderHistoryById(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetUserOrderHistoryById`,
            params: { id: id },
            auth: {
                username: secureLocalStorage.getItem('login'),
                password: secureLocalStorage.getItem('password')
            }
        };
        const response = await axios(options);
        if (response.status === get200().Code && response.statusText === get200().Message) {
            return response;
        }
        return null;
    };

    static async CreateUserOrderHistory(newRecord) {

        const options = {
            method: 'post',
            url: `${getRestAPIUrl()}/Database/CreateUserOrderHistory`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(newRecord),
            auth: {
                username: secureLocalStorage.getItem('login'),
                password: secureLocalStorage.getItem('password')
            }
        };

        var responseError = "";
        const response = await axios(options)
            .catch((error) => {
                console.log(error.response.data.Message);
                responseError = error.response.data.Message;
            });

        if (response) {
            if (response.status === get201().Code && response.statusText === get201().Message) {
                return response;
            }
        }
        else {
            return responseError;
        }
    };

    static async UpdateUserOrderHistory(oldRecord) {

        const options = {
            method: 'put',
            url: `${getRestAPIUrl()}/Database/UpdateUserOrderHistory`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(oldRecord),
            auth: {
                username: secureLocalStorage.getItem('login'),
                password: secureLocalStorage.getItem('password')
            }
        };

        var responseError = "";
        const response = await axios(options)
            .catch((error) => {
                console.log(error.response.data.Message);
                responseError = error.response.data.Message;
            });

        if (response) {
            if (response.status === get201().Code && response.statusText === get201().Message) {
                return response;
            }
        }
        else {
            return responseError;
        }
    };

    static async DeleteUserOrderHistory(id) {

        const options = {
            method: 'delete',
            url: `${getRestAPIUrl()}/Database/DeleteUserOrderHistory`,
            params: { id: id },
            auth: {
                username: secureLocalStorage.getItem('login'),
                password: secureLocalStorage.getItem('password')
            }
        };
        const response = await axios(options);
        if (response.status === get200().Code && response.statusText === get200().Message) {
            return response;
        }
        return null;
    };

};