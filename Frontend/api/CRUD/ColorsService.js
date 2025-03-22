import ApiService from '../ApiService.js';

export default class ColorsService {
  static async GetColorsCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetColorsCount', token);
  }

  static async GetColorsFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetColorsFields', token);
  }

  static async GetColors(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetColors', token, null, { limit, page });
  }

  static async GetColorsById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetColorsById', token, null, { id });
  }

  static async CreateColors(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateColors', token, newRecord);
  }

  static async UpdateColors(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateColors', token, oldRecord);
  }

  static async DeleteColors(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteColors', token, null, { id });
  }
}
