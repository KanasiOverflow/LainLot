import ApiService from './ApiService.js';

export default class CustomSweatersService {
  static async GetCustomSweatersCount(login, password) {
    return ApiService.sendRequest('get', 'GetCustomSweatersCount', login, password);
  }

  static async GetCustomSweatersFields(login, password) {
    return ApiService.sendRequest('get', 'GetCustomSweatersFields', login, password);
  }

  static async GetCustomSweaters(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetCustomSweaters', login, password, null, { limit, page });
  }

  static async GetCustomSweatersById(id, login, password) {
    return ApiService.sendRequest('get', 'GetCustomSweatersById', login, password, null, { id });
  }

  static async CreateCustomSweaters(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateCustomSweaters', login, password, newRecord);
  }

  static async UpdateCustomSweaters(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateCustomSweaters', login, password, oldRecord);
  }

  static async DeleteCustomSweaters(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteCustomSweaters', login, password, null, { id });
  }
}
