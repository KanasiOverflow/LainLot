import ApiService from '../ApiService.js';

export default class BaseSleeveCuffsService {
  static async GetBaseSleeveCuffsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSleeveCuffsCount', login, password);
  }

  static async GetBaseSleeveCuffsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSleeveCuffsFields', login, password);
  }

  static async GetBaseSleeveCuffs(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSleeveCuffs', login, password, null, { limit, page });
  }

  static async GetBaseSleeveCuffsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSleeveCuffsById', login, password, null, { id });
  }

  static async CreateBaseSleeveCuffs(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateBaseSleeveCuffs', login, password, newRecord);
  }

  static async UpdateBaseSleeveCuffs(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateBaseSleeveCuffs', login, password, oldRecord);
  }

  static async DeleteBaseSleeveCuffs(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteBaseSleeveCuffs', login, password, null, { id });
  }
}
