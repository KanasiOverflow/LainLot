import ApiService from './ApiService.js';

export default class CheckCredentialsService {
  static async Login(login, password) {
    try {
      const response = await ApiService.sendRequest('auth', 'post', 'auth', 'login', null, { login, password }, null);

      return response;

    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }
}
