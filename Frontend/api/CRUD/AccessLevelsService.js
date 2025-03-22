import ApiService from '../ApiService.js';

export default class AccessLevelsService {
  static async GetAccessLevelsCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetAccessLevelsCount', token);
  }

  static async GetAccessLevelsFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetAccessLevelsFields', token);
  }

  static async GetAccessLevels(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetAccessLevels', token, null, { limit, page });
  }

  static async GetAccessLevelsById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetAccessLevelsById', token, null, { id });
  }

  static async CreateAccessLevels(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateAccessLevels', token, newRecord);
  }

  static async UpdateAccessLevels(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateAccessLevels', token, oldRecord);
  }

  static async DeleteAccessLevels(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteAccessLevels', token, null, { id });
  }
}
