import ApiService from '../ApiService.js';

export default class CustomBeltsService {
  static async GetCustomBeltsCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomBeltsCount', token);
  }

  static async GetCustomBeltsFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomBeltsFields', token);
  }

  static async GetCustomBelts(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomBelts', token, null, { limit, page });
  }

  static async GetCustomBeltsById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomBeltsById', token, null, { id });
  }

  static async CreateCustomBelts(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateCustomBelts', token, newRecord);
  }

  static async UpdateCustomBelts(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCustomBelts', token, oldRecord);
  }

  static async DeleteCustomBelts(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCustomBelts', token, null, { id });
  }
}
