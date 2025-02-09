import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { get200, get201 } from '../utils/responseCodes';
import { getRestAPIUrl } from '../utils/getRestAPIUrl';

export default class CartService {

    static async GetCartCount() {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetCartCount`,
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

    static async GetCartFields() {
        
        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetCartFields`,
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

    static async GetCart(limit, page) {
        
        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetCart?limit=${limit}&page=${page}`,
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

    static async GetCartById(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetCartById`,
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

    static async CreateCart(newRecord) {

        const options = {
            method: 'post',
            url: `${getRestAPIUrl()}/Database/CreateCart`,
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

    static async UpdateCart(oldRecord) {

        const options = {
            method: 'put',
            url: `${getRestAPIUrl()}/Database/UpdateCart`,
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

    static async DeleteCart(id) {

        const options = {
            method: 'delete',
            url: `${getRestAPIUrl()}/Database/DeleteCart`,
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