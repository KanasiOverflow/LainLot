import axios from 'axios';

export default class FakePostService {
    static async getAll(limit = 10, page = 1) {
        const responce = await axios.get('https://jsonplaceholder.typicode.com/posts/', {
            params: {
                _limit: limit,
                _page: page
            }
        });
        return responce;
    };

    static async getbyId(id) {
        const responce = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
        return responce;
    };

    static async getCommentsById(id) {
        const responce = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
        return responce;
    };
};