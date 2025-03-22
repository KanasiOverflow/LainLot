import ApiService from '../ApiService.js';

export default class CustomPantsService {
  static async GetCustomPantsCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomPantsCount', token);
  }

  static async GetCustomPantsFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomPantsFields', token);
  }

  static async GetCustomPants(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomPants', token, null, { limit, page });
  }

  static async GetCustomPantsById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomPantsById', token, null, { id });
  }

  static async CreateCustomPants(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateCustomPants', token, newRecord);
  }

  static async UpdateCustomPants(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCustomPants', token, oldRecord);
  }

  static async DeleteCustomPants(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCustomPants', token, null, { id });
  }
}
