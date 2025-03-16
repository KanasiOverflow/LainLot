import ApiService from './ApiService.js';

export default class BaseSweatersService {
  static async GetBaseSweatersCount(login, password) {
    return ApiService.sendRequest('get', 'GetBaseSweatersCount', login, password);
  }

  static async GetBaseSweatersFields(login, password) {
    return ApiService.sendRequest('get', 'GetBaseSweatersFields', login, password);
  }

  static async GetBaseSweaters(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetBaseSweaters', login, password, null, { limit, page });
  }

  static async GetBaseSweatersById(id, login, password) {
    return ApiService.sendRequest('get', 'GetBaseSweatersById', login, password, null, { id });
  }

  static async CreateBaseSweaters(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateBaseSweaters', login, password, newRecord);
  }

  static async UpdateBaseSweaters(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateBaseSweaters', login, password, oldRecord);
  }

  static async DeleteBaseSweaters(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteBaseSweaters', login, password, null, { id });
  }
}
