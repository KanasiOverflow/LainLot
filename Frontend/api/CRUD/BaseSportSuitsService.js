import ApiService from '../ApiService.js';

export default class BaseSportSuitsService {
  static async GetBaseSportSuitsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSportSuitsCount', login, password);
  }

  static async GetBaseSportSuitsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSportSuitsFields', login, password);
  }

  static async GetBaseSportSuits(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSportSuits', login, password, null, { limit, page });
  }

  static async GetBaseSportSuitsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSportSuitsById', login, password, null, { id });
  }

  static async CreateBaseSportSuits(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateBaseSportSuits', login, password, newRecord);
  }

  static async UpdateBaseSportSuits(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateBaseSportSuits', login, password, oldRecord);
  }

  static async DeleteBaseSportSuits(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteBaseSportSuits', login, password, null, { id });
  }
}
