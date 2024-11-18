import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { get200, get201 } from './utils/responseCodes';
import { getRestAPIUrl } from './utils/getRestAPIUrl';

export default class CustomizationOrdersService {

    static async GetCustomizationOrdersCount() {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetCustomizationOrdersCount`,
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

    static async GetCustomizationOrdersFields() {
        
        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetCustomizationOrdersFields`,
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

    static async GetCustomizationOrders(limit, page) {
        
        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetCustomizationOrders?limit=${limit}&page=${page}`,
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

    static async GetCustomizationOrdersById(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetCustomizationOrdersById`,
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

    static async CreateCustomizationOrders(newRecord) {

        const options = {
            method: 'post',
            url: `${getRestAPIUrl()}/Database/CreateCustomizationOrders`,
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

    static async UpdateCustomizationOrders(oldRecord) {

        const options = {
            method: 'put',
            url: `${getRestAPIUrl()}/Database/UpdateCustomizationOrders`,
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

    static async DeleteCustomizationOrders(id) {

        const options = {
            method: 'delete',
            url: `${getRestAPIUrl()}/Database/DeleteCustomizationOrders`,
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