import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { get200 } from '../utils/responseCodes';
import { getRestAPIUrl } from '../utils/getRestAPIUrl';

export default class ForeignKeysService {

    static async GetFkAccessLevelsData(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetFkAccessLevelsData`,
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

    static async GetFkLanguagesData(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetFkLanguagesData`,
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

    static async GetFkPostsData(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetFkPostsData`,
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

    static async GetFkUsersData(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetFkUsersData`,
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

    static async GetFkUserRoles(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetFkUserRoles`,
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