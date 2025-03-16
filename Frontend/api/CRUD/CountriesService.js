import ApiService from './ApiService.js';

export default class CountriesService {
  static async GetCountriesCount(login, password) {
    return ApiService.sendRequest('get', 'GetCountriesCount', login, password);
  }

  static async GetCountriesFields(login, password) {
    return ApiService.sendRequest('get', 'GetCountriesFields', login, password);
  }

  static async GetCountries(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetCountries', login, password, null, { limit, page });
  }

  static async GetCountriesById(id, login, password) {
    return ApiService.sendRequest('get', 'GetCountriesById', login, password, null, { id });
  }

  static async CreateCountries(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateCountries', login, password, newRecord);
  }

  static async UpdateCountries(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateCountries', login, password, oldRecord);
  }

  static async DeleteCountries(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteCountries', login, password, null, { id });
  }
}
