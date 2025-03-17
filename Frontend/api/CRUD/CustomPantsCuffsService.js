import ApiService from '../ApiService.js';

export default class CustomPantsCuffsService {
  static async GetCustomPantsCuffsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomPantsCuffsCount', login, password);
  }

  static async GetCustomPantsCuffsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomPantsCuffsFields', login, password);
  }

  static async GetCustomPantsCuffs(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomPantsCuffs', login, password, null, { limit, page });
  }

  static async GetCustomPantsCuffsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomPantsCuffsById', login, password, null, { id });
  }

  static async CreateCustomPantsCuffs(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateCustomPantsCuffs', login, password, newRecord);
  }

  static async UpdateCustomPantsCuffs(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCustomPantsCuffs', login, password, oldRecord);
  }

  static async DeleteCustomPantsCuffs(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCustomPantsCuffs', login, password, null, { id });
  }
}
