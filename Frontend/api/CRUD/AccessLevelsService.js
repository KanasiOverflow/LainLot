import ApiService from '../ApiService.js';

export default class AccessLevelsService {
  static async GetAccessLevelsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetAccessLevelsCount', login, password);
  }

  static async GetAccessLevelsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetAccessLevelsFields', login, password);
  }

  static async GetAccessLevels(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetAccessLevels', login, password, null, { limit, page });
  }

  static async GetAccessLevelsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetAccessLevelsById', login, password, null, { id });
  }

  static async CreateAccessLevels(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateAccessLevels', login, password, newRecord);
  }

  static async UpdateAccessLevels(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateAccessLevels', login, password, oldRecord);
  }

  static async DeleteAccessLevels(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteAccessLevels', login, password, null, { id });
  }
}
