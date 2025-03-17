import ApiService from '../ApiService.js';

export default class CustomSleeveCuffsService {
  static async GetCustomSleeveCuffsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSleeveCuffsCount', login, password);
  }

  static async GetCustomSleeveCuffsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSleeveCuffsFields', login, password);
  }

  static async GetCustomSleeveCuffs(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSleeveCuffs', login, password, null, { limit, page });
  }

  static async GetCustomSleeveCuffsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSleeveCuffsById', login, password, null, { id });
  }

  static async CreateCustomSleeveCuffs(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateCustomSleeveCuffs', login, password, newRecord);
  }

  static async UpdateCustomSleeveCuffs(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCustomSleeveCuffs', login, password, oldRecord);
  }

  static async DeleteCustomSleeveCuffs(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCustomSleeveCuffs', login, password, null, { id });
  }
}
