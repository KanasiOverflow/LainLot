import ApiService from './ApiService.js';

export default class BaseSleeveCuffsService {
  static async GetBaseSleeveCuffsCount(login, password) {
    return ApiService.sendRequest('get', 'GetBaseSleeveCuffsCount', login, password);
  }

  static async GetBaseSleeveCuffsFields(login, password) {
    return ApiService.sendRequest('get', 'GetBaseSleeveCuffsFields', login, password);
  }

  static async GetBaseSleeveCuffs(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetBaseSleeveCuffs', login, password, null, { limit, page });
  }

  static async GetBaseSleeveCuffsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetBaseSleeveCuffsById', login, password, null, { id });
  }

  static async CreateBaseSleeveCuffs(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateBaseSleeveCuffs', login, password, newRecord);
  }

  static async UpdateBaseSleeveCuffs(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateBaseSleeveCuffs', login, password, oldRecord);
  }

  static async DeleteBaseSleeveCuffs(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteBaseSleeveCuffs', login, password, null, { id });
  }
}
