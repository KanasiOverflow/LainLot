import ApiService from './ApiService.js';

export default class CheckCredentialsService {
  static async Login(token) {
    try {
      const response = await ApiService.sendRequest(
        'post',
        'auth',
        'login',
        { token }
      );

      return response;

    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }
}
