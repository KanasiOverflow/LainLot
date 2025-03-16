import ApiService from './ApiService.js';

export default class CustomNecklinesService {
  static async GetCustomNecklinesCount(login, password) {
    return ApiService.sendRequest('get', 'GetCustomNecklinesCount', login, password);
  }

  static async GetCustomNecklinesFields(login, password) {
    return ApiService.sendRequest('get', 'GetCustomNecklinesFields', login, password);
  }

  static async GetCustomNecklines(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetCustomNecklines', login, password, null, { limit, page });
  }

  static async GetCustomNecklinesById(id, login, password) {
    return ApiService.sendRequest('get', 'GetCustomNecklinesById', login, password, null, { id });
  }

  static async CreateCustomNecklines(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateCustomNecklines', login, password, newRecord);
  }

  static async UpdateCustomNecklines(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateCustomNecklines', login, password, oldRecord);
  }

  static async DeleteCustomNecklines(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteCustomNecklines', login, password, null, { id });
  }
}
