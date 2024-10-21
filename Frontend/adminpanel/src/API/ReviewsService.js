import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { get200, get201 } from '../utils/responseCodes';
import { getRestAPIUrl } from '../utils/getRestAPIUrl';

export default class ReviewsService {

    static async GetReviewsCount() {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetReviewsCount`,
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

    static async GetReviewsFields() {
        
        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetReviewsFields`,
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

    static async GetReviews(limit, page) {
        
        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/GetReviews?limit=${limit}&page=${page}`,
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

    static async GetReviewsById(id) {

        const options = {
            method: 'get',
            url: `${getRestAPIUrl()}/Database/Database/GetReviewsById`,
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

    static async CreateReviews(newRecord) {

        const options = {
            method: 'post',
            url: `${getRestAPIUrl()}/Database/CreateReviews`,
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

    static async UpdateReviews(oldRecord) {

        const options = {
            method: 'put',
            url: `${getRestAPIUrl()}/Database/UpdateReviews`,
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

    static async DeleteReviews(id) {

        const options = {
            method: 'delete',
            url: `${getRestAPIUrl()}/Database/DeleteReviews`,
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