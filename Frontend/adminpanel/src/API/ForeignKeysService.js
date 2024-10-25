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

    static async GetFkCategoriesData(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetFkCategoriesData`,
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

    static async GetFkFabricTypesData(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetFkFabricTypesData`,
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

    static async GetFkProductsData(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetFkProductsData`,
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

    static async GetFkProductImagesData(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetFkProductImagesData`,
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

    static async GetFkProductTranslationsData(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetFkProductTranslationsData`,
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

    static async GetFkReviewsData(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetFkReviewsData`,
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

    static async GetFkOrdersData(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetFkOrdersData`,
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

    static async GetFkOrderHistoryData(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetFkOrdersData`,
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

    static async GetFkPaymentsData(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetFkPaymentsData`,
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