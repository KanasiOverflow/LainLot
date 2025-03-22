import ApiService from '../ApiService.js';

export default class CountriesService {
  static async GetCountriesCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetCountriesCount', token);
  }

  static async GetCountriesFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetCountriesFields', token);
  }

  static async GetCountries(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetCountries', token, null, { limit, page });
  }

  static async GetCountriesById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetCountriesById', token, null, { id });
  }

  static async CreateCountries(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateCountries', token, newRecord);
  }

  static async UpdateCountries(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCountries', token, oldRecord);
  }

  static async DeleteCountries(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCountries', token, null, { id });
  }
}
