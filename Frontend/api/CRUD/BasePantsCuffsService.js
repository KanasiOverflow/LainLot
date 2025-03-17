import ApiService from '../ApiService.js';

export default class BasePantsCuffsService {
  static async GetBasePantsCuffsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBasePantsCuffsCount', login, password);
  }

  static async GetBasePantsCuffsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBasePantsCuffsFields', login, password);
  }

  static async GetBasePantsCuffs(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBasePantsCuffs', login, password, null, { limit, page });
  }

  static async GetBasePantsCuffsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBasePantsCuffsById', login, password, null, { id });
  }

  static async CreateBasePantsCuffs(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateBasePantsCuffs', login, password, newRecord);
  }

  static async UpdateBasePantsCuffs(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateBasePantsCuffs', login, password, oldRecord);
  }

  static async DeleteBasePantsCuffs(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteBasePantsCuffs', login, password, null, { id });
  }
}
