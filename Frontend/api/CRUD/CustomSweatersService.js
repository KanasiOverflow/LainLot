import ApiService from '../ApiService.js';

export default class CustomSweatersService {
  static async GetCustomSweatersCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSweatersCount', login, password);
  }

  static async GetCustomSweatersFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSweatersFields', login, password);
  }

  static async GetCustomSweaters(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSweaters', login, password, null, { limit, page });
  }

  static async GetCustomSweatersById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSweatersById', login, password, null, { id });
  }

  static async CreateCustomSweaters(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateCustomSweaters', login, password, newRecord);
  }

  static async UpdateCustomSweaters(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCustomSweaters', login, password, oldRecord);
  }

  static async DeleteCustomSweaters(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCustomSweaters', login, password, null, { id });
  }
}
