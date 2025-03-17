import ApiService from '../ApiService.js';

export default class CurrenciesService {
  static async GetCurrenciesCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCurrenciesCount', login, password);
  }

  static async GetCurrenciesFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCurrenciesFields', login, password);
  }

  static async GetCurrencies(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCurrencies', login, password, null, { limit, page });
  }

  static async GetCurrenciesById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCurrenciesById', login, password, null, { id });
  }

  static async CreateCurrencies(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateCurrencies', login, password, newRecord);
  }

  static async UpdateCurrencies(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCurrencies', login, password, oldRecord);
  }

  static async DeleteCurrencies(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCurrencies', login, password, null, { id });
  }
}
