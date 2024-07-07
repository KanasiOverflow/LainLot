import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { get200, get201 } from '../utils/responseCodes';

export default class LanguagesService {

    static async GetLanguagesFields() {
        
        const options = {
            method: 'get',
            url: 'http://localhost:8040/api/v1/Database/GetLanguagesFields',
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

    static async GetLanguages(limit, page) {
        
        const options = {
            method: 'get',
            url: `http://localhost:8040/api/v1/Database/GetLanguages?limit=${limit}&page=${page}`,
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

    static async GetLanguagesById(id) {

        const options = {
            method: 'get',
            url: 'http://localhost:8040/api/v1/Database/GetLanguagesById',
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

    static async CreateLanguage(newRecord) {

        const options = {
            method: 'post',
            url: 'http://localhost:8040/api/v1/Database/CreateLanguage',
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

    static async UpdateLanguage(oldRecord) {

        const options = {
            method: 'put',
            url: 'http://localhost:8040/api/v1/Database/UpdateLanguage',
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

    static async DeleteLanguage(id) {

        const options = {
            method: 'delete',
            url: 'http://localhost:8040/api/v1/Database/DeleteLanguage',
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