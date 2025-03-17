import ApiService from '../ApiService.js';

export default class CustomPantsService {
  static async GetCustomPantsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomPantsCount', login, password);
  }

  static async GetCustomPantsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomPantsFields', login, password);
  }

  static async GetCustomPants(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomPants', login, password, null, { limit, page });
  }

  static async GetCustomPantsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomPantsById', login, password, null, { id });
  }

  static async CreateCustomPants(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateCustomPants', login, password, newRecord);
  }

  static async UpdateCustomPants(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCustomPants', login, password, oldRecord);
  }

  static async DeleteCustomPants(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCustomPants', login, password, null, { id });
  }
}
