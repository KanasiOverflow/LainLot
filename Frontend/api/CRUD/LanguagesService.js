import ApiService from '../ApiService.js';

export default class LanguagesService {
  static async GetLanguagesCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetLanguagesCount', login, password);
  }

  static async GetLanguagesFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetLanguagesFields', login, password);
  }

  static async GetLanguages(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetLanguages', login, password, null, { limit, page });
  }

  static async GetLanguagesById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetLanguagesById', login, password, null, { id });
  }

  static async CreateLanguages(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateLanguages', login, password, newRecord);
  }

  static async UpdateLanguages(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateLanguages', login, password, oldRecord);
  }

  static async DeleteLanguages(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteLanguages', login, password, null, { id });
  }
}
