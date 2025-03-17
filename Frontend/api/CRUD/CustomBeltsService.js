import ApiService from '../ApiService.js';

export default class CustomBeltsService {
  static async GetCustomBeltsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomBeltsCount', login, password);
  }

  static async GetCustomBeltsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomBeltsFields', login, password);
  }

  static async GetCustomBelts(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomBelts', login, password, null, { limit, page });
  }

  static async GetCustomBeltsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomBeltsById', login, password, null, { id });
  }

  static async CreateCustomBelts(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateCustomBelts', login, password, newRecord);
  }

  static async UpdateCustomBelts(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCustomBelts', login, password, oldRecord);
  }

  static async DeleteCustomBelts(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCustomBelts', login, password, null, { id });
  }
}
