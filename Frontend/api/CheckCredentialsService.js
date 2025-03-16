import axios from 'axios';
import { getRestAPIUrl } from './utils/getRestAPIUrl.js';

export default class CheckCredentialsService {
  static async CheckCredentials(login, password) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/CredentialsChecker/CheckCredentials`,
      auth: {
        username: login,
        password: password,
      },
    };

    const response = await axios(options).catch((error) => {
      console.error(error);
    });

    return response;
  }
}
