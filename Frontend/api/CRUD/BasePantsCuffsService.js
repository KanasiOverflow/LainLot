import ApiService from './ApiService.js';

export default class BasePantsCuffsService {
  static async GetBasePantsCuffsCount(login, password) {
    return ApiService.sendRequest('get', 'GetBasePantsCuffsCount', login, password);
  }

  static async GetBasePantsCuffsFields(login, password) {
    return ApiService.sendRequest('get', 'GetBasePantsCuffsFields', login, password);
  }

  static async GetBasePantsCuffs(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetBasePantsCuffs', login, password, null, { limit, page });
  }

  static async GetBasePantsCuffsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetBasePantsCuffsById', login, password, null, { id });
  }

  static async CreateBasePantsCuffs(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateBasePantsCuffs', login, password, newRecord);
  }

  static async UpdateBasePantsCuffs(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateBasePantsCuffs', login, password, oldRecord);
  }

  static async DeleteBasePantsCuffs(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteBasePantsCuffs', login, password, null, { id });
  }
}
