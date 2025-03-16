import ApiService from './ApiService.js';

export default class AccessLevelsService {
  static async GetAccessLevelsCount(login, password) {
    return ApiService.sendRequest('get', 'GetAccessLevelsCount', login, password);
  }

  static async GetAccessLevelsFields(login, password) {
    return ApiService.sendRequest('get', 'GetAccessLevelsFields', login, password);
  }

  static async GetAccessLevels(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetAccessLevels', login, password, null, { limit, page });
  }

  static async GetAccessLevelsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetAccessLevelsById', login, password, null, { id });
  }

  static async CreateAccessLevels(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateAccessLevels', login, password, newRecord);
  }

  static async UpdateAccessLevels(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateAccessLevels', login, password, oldRecord);
  }

  static async DeleteAccessLevels(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteAccessLevels', login, password, null, { id });
  }
}
