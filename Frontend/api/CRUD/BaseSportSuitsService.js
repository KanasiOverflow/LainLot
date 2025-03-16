import ApiService from './ApiService.js';

export default class BaseSportSuitsService {
  static async GetBaseSportSuitsCount(login, password) {
    return ApiService.sendRequest('get', 'GetBaseSportSuitsCount', login, password);
  }

  static async GetBaseSportSuitsFields(login, password) {
    return ApiService.sendRequest('get', 'GetBaseSportSuitsFields', login, password);
  }

  static async GetBaseSportSuits(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetBaseSportSuits', login, password, null, { limit, page });
  }

  static async GetBaseSportSuitsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetBaseSportSuitsById', login, password, null, { id });
  }

  static async CreateBaseSportSuits(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateBaseSportSuits', login, password, newRecord);
  }

  static async UpdateBaseSportSuits(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateBaseSportSuits', login, password, oldRecord);
  }

  static async DeleteBaseSportSuits(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteBaseSportSuits', login, password, null, { id });
  }
}
