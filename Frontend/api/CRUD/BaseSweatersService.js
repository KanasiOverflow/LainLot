import ApiService from '../ApiService.js';

export default class BaseSweatersService {
  static async GetBaseSweatersCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSweatersCount', token);
  }

  static async GetBaseSweatersFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSweatersFields', token);
  }

  static async GetBaseSweaters(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSweaters', token, null, { limit, page });
  }

  static async GetBaseSweatersById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSweatersById', token, null, { id });
  }

  static async CreateBaseSweaters(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateBaseSweaters', token, newRecord);
  }

  static async UpdateBaseSweaters(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateBaseSweaters', token, oldRecord);
  }

  static async DeleteBaseSweaters(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteBaseSweaters', token, null, { id });
  }
}
