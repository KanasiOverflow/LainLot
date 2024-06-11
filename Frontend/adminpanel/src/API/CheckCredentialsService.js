import axios from 'axios';

export default class CheckCredentialsService {

    static async CheckCredentials(login, password) {
        const options = {
            method: 'get',
            url: 'http://localhost:8040/api/v1/CredentialsChecker/CheckCredentials',
            auth: {
                username: login,
                password: password
            }
        };
        
        const response = await axios(options)
            .catch((error) => {
                console.error(error);
            });

        return response;
    };
};