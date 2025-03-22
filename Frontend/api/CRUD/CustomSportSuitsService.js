import ApiService from '../ApiService.js';

export default class CustomSportSuitsService {
  static async GetCustomSportSuitsCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSportSuitsCount', token);
  }

  static async GetCustomSportSuitsFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSportSuitsFields', token);
  }

  static async GetCustomSportSuits(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSportSuits', token, null, { limit, page });
  }

  static async GetCustomSportSuitsById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomSportSuitsById', token, null, { id });
  }

  static async CreateCustomSportSuits(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateCustomSportSuits', token, newRecord);
  }

  static async UpdateCustomSportSuits(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCustomSportSuits', token, oldRecord);
  }

  static async DeleteCustomSportSuits(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCustomSportSuits', token, null, { id });
  }
}
