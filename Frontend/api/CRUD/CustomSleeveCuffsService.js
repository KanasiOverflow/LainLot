import ApiService from './ApiService.js';

export default class CustomSleeveCuffsService {
  static async GetCustomSleeveCuffsCount(login, password) {
    return ApiService.sendRequest('get', 'GetCustomSleeveCuffsCount', login, password);
  }

  static async GetCustomSleeveCuffsFields(login, password) {
    return ApiService.sendRequest('get', 'GetCustomSleeveCuffsFields', login, password);
  }

  static async GetCustomSleeveCuffs(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetCustomSleeveCuffs', login, password, null, { limit, page });
  }

  static async GetCustomSleeveCuffsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetCustomSleeveCuffsById', login, password, null, { id });
  }

  static async CreateCustomSleeveCuffs(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateCustomSleeveCuffs', login, password, newRecord);
  }

  static async UpdateCustomSleeveCuffs(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateCustomSleeveCuffs', login, password, oldRecord);
  }

  static async DeleteCustomSleeveCuffs(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteCustomSleeveCuffs', login, password, null, { id });
  }
}
