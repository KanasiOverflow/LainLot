import ApiService from './ApiService.js';

export default class CheckCredentialsService {
  static async CheckCredentials(login, password) {
    try {
      return await ApiService.sendRequest('get', 'CredentialsChecker', 'CheckCredentials', login, password);
    } catch (error) {
      console.error(`Error checking credentials:`, error);
      return null;
    }
  }
}
