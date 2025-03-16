import ApiService from './ApiService.js';

export default class CustomPantsCuffsService {
  static async GetCustomPantsCuffsCount(login, password) {
    return ApiService.sendRequest('get', 'GetCustomPantsCuffsCount', login, password);
  }

  static async GetCustomPantsCuffsFields(login, password) {
    return ApiService.sendRequest('get', 'GetCustomPantsCuffsFields', login, password);
  }

  static async GetCustomPantsCuffs(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetCustomPantsCuffs', login, password, null, { limit, page });
  }

  static async GetCustomPantsCuffsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetCustomPantsCuffsById', login, password, null, { id });
  }

  static async CreateCustomPantsCuffs(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateCustomPantsCuffs', login, password, newRecord);
  }

  static async UpdateCustomPantsCuffs(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateCustomPantsCuffs', login, password, oldRecord);
  }

  static async DeleteCustomPantsCuffs(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteCustomPantsCuffs', login, password, null, { id });
  }
}
