import ApiService from './ApiService.js';

export default class CustomPantsService {
  static async GetCustomPantsCount(login, password) {
    return ApiService.sendRequest('get', 'GetCustomPantsCount', login, password);
  }

  static async GetCustomPantsFields(login, password) {
    return ApiService.sendRequest('get', 'GetCustomPantsFields', login, password);
  }

  static async GetCustomPants(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetCustomPants', login, password, null, { limit, page });
  }

  static async GetCustomPantsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetCustomPantsById', login, password, null, { id });
  }

  static async CreateCustomPants(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateCustomPants', login, password, newRecord);
  }

  static async UpdateCustomPants(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateCustomPants', login, password, oldRecord);
  }

  static async DeleteCustomPants(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteCustomPants', login, password, null, { id });
  }
}
