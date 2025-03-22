import ApiService from '../ApiService.js';

export default class CustomNecklinesService {
  static async GetCustomNecklinesCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomNecklinesCount', token);
  }

  static async GetCustomNecklinesFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomNecklinesFields', token);
  }

  static async GetCustomNecklines(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomNecklines', token, null, { limit, page });
  }

  static async GetCustomNecklinesById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomNecklinesById', token, null, { id });
  }

  static async CreateCustomNecklines(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateCustomNecklines', token, newRecord);
  }

  static async UpdateCustomNecklines(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCustomNecklines', token, oldRecord);
  }

  static async DeleteCustomNecklines(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCustomNecklines', token, null, { id });
  }
}
