import ApiService from './ApiService.js';

export default class CustomSportSuitsService {
  static async GetCustomSportSuitsCount(login, password) {
    return ApiService.sendRequest('get', 'GetCustomSportSuitsCount', login, password);
  }

  static async GetCustomSportSuitsFields(login, password) {
    return ApiService.sendRequest('get', 'GetCustomSportSuitsFields', login, password);
  }

  static async GetCustomSportSuits(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetCustomSportSuits', login, password, null, { limit, page });
  }

  static async GetCustomSportSuitsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetCustomSportSuitsById', login, password, null, { id });
  }

  static async CreateCustomSportSuits(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateCustomSportSuits', login, password, newRecord);
  }

  static async UpdateCustomSportSuits(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateCustomSportSuits', login, password, oldRecord);
  }

  static async DeleteCustomSportSuits(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteCustomSportSuits', login, password, null, { id });
  }
}
