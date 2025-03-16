import ApiService from './ApiService.js';

export default class CustomBeltsService {
  static async GetCustomBeltsCount(login, password) {
    return ApiService.sendRequest('get', 'GetCustomBeltsCount', login, password);
  }

  static async GetCustomBeltsFields(login, password) {
    return ApiService.sendRequest('get', 'GetCustomBeltsFields', login, password);
  }

  static async GetCustomBelts(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetCustomBelts', login, password, null, { limit, page });
  }

  static async GetCustomBeltsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetCustomBeltsById', login, password, null, { id });
  }

  static async CreateCustomBelts(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateCustomBelts', login, password, newRecord);
  }

  static async UpdateCustomBelts(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateCustomBelts', login, password, oldRecord);
  }

  static async DeleteCustomBelts(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteCustomBelts', login, password, null, { id });
  }
}
