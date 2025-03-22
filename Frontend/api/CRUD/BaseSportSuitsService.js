import ApiService from '../ApiService.js';

export default class BaseSportSuitsService {
  static async GetBaseSportSuitsCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSportSuitsCount', token);
  }

  static async GetBaseSportSuitsFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSportSuitsFields', token);
  }

  static async GetBaseSportSuits(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSportSuits', token, null, { limit, page });
  }

  static async GetBaseSportSuitsById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSportSuitsById', token, null, { id });
  }

  static async CreateBaseSportSuits(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateBaseSportSuits', token, newRecord);
  }

  static async UpdateBaseSportSuits(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateBaseSportSuits', token, oldRecord);
  }

  static async DeleteBaseSportSuits(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteBaseSportSuits', token, null, { id });
  }
}
