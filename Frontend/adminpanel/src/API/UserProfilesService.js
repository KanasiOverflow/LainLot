import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { get200, get201 } from '../utils/responseCodes';
import { getRestAPIUrl } from '../utils/getRestAPIUrl';

export default class UserProfilesService {

    static async GetUserProfilesCount() {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetUserProfilesCount`,
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

    static async GetUserProfilesFields() {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetUserProfilesFields`,
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

    static async GetUserProfiles(limit, page) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetUserProfiles?limit=${limit}&page=${page}`,
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

    static async GetUserProfilesById(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetUserProfilesById`,
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

    static async CreateUserProfiles(newRecord) {

        const options = {
            method: 'post',
            url: `${getRestAPIUrl()}/Database/CreateUserProfiles`,
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

    static async UpdateUserProfiles(oldRecord) {

        const options = {
            method: 'put',
            url: `${getRestAPIUrl()}/Database/UpdateUserProfiles`,
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

    static async DeleteUserProfiles(id) {

        const options = {
            method: 'delete',
            url: `${getRestAPIUrl()}/Database/DeleteUserProfiles`,
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