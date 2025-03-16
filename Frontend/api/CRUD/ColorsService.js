import ApiService from './ApiService.js';

export default class ColorsService {
  static async GetColorsCount(login, password) {
    return ApiService.sendRequest('get', 'GetColorsCount', login, password);
  }

  static async GetColorsFields(login, password) {
    return ApiService.sendRequest('get', 'GetColorsFields', login, password);
  }

  static async GetColors(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetColors', login, password, null, { limit, page });
  }

  static async GetColorsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetColorsById', login, password, null, { id });
  }

  static async CreateColors(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateColors', login, password, newRecord);
  }

  static async UpdateColors(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateColors', login, password, oldRecord);
  }

  static async DeleteColors(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteColors', login, password, null, { id });
  }
}
