import ApiService from '../ApiService.js';

export default class CustomSportSuitsService {
  static async GetCustomSportSuitsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSportSuitsCount', login, password);
  }

  static async GetCustomSportSuitsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSportSuitsFields', login, password);
  }

  static async GetCustomSportSuits(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSportSuits', login, password, null, { limit, page });
  }

  static async GetCustomSportSuitsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSportSuitsById', login, password, null, { id });
  }

  static async CreateCustomSportSuits(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateCustomSportSuits', login, password, newRecord);
  }

  static async UpdateCustomSportSuits(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCustomSportSuits', login, password, oldRecord);
  }

  static async DeleteCustomSportSuits(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCustomSportSuits', login, password, null, { id });
  }
}
