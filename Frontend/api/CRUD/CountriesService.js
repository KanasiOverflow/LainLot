import ApiService from '../ApiService.js';

export default class CountriesService {
  static async GetCountriesCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCountriesCount', login, password);
  }

  static async GetCountriesFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCountriesFields', login, password);
  }

  static async GetCountries(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCountries', login, password, null, { limit, page });
  }

  static async GetCountriesById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCountriesById', login, password, null, { id });
  }

  static async CreateCountries(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateCountries', login, password, newRecord);
  }

  static async UpdateCountries(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCountries', login, password, oldRecord);
  }

  static async DeleteCountries(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCountries', login, password, null, { id });
  }
}
