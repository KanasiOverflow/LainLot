import ApiService from './ApiService.js';

export default class CurrenciesService {
  static async GetCurrenciesCount(login, password) {
    return ApiService.sendRequest('get', 'GetCurrenciesCount', login, password);
  }

  static async GetCurrenciesFields(login, password) {
    return ApiService.sendRequest('get', 'GetCurrenciesFields', login, password);
  }

  static async GetCurrencies(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetCurrencies', login, password, null, { limit, page });
  }

  static async GetCurrenciesById(id, login, password) {
    return ApiService.sendRequest('get', 'GetCurrenciesById', login, password, null, { id });
  }

  static async CreateCurrencies(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateCurrencies', login, password, newRecord);
  }

  static async UpdateCurrencies(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateCurrencies', login, password, oldRecord);
  }

  static async DeleteCurrencies(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteCurrencies', login, password, null, { id });
  }
}
