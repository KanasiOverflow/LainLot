import ApiService from '../ApiService.js';

export default class BaseSleeveCuffsService {
  static async GetBaseSleeveCuffsCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSleeveCuffsCount', token);
  }

  static async GetBaseSleeveCuffsFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSleeveCuffsFields', token);
  }

  static async GetBaseSleeveCuffs(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSleeveCuffs', token, null, { limit, page });
  }

  static async GetBaseSleeveCuffsById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSleeveCuffsById', token, null, { id });
  }

  static async CreateBaseSleeveCuffs(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateBaseSleeveCuffs', token, newRecord);
  }

  static async UpdateBaseSleeveCuffs(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateBaseSleeveCuffs', token, oldRecord);
  }

  static async DeleteBaseSleeveCuffs(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteBaseSleeveCuffs', token, null, { id });
  }
}
