import ApiService from './ApiService.js';

export default class LanguagesService {
  static async GetLanguagesCount(login, password) {
    return ApiService.sendRequest('get', 'GetLanguagesCount', login, password);
  }

  static async GetLanguagesFields(login, password) {
    return ApiService.sendRequest('get', 'GetLanguagesFields', login, password);
  }

  static async GetLanguages(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetLanguages', login, password, null, { limit, page });
  }

  static async GetLanguagesById(id, login, password) {
    return ApiService.sendRequest('get', 'GetLanguagesById', login, password, null, { id });
  }

  static async CreateLanguages(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateLanguages', login, password, newRecord);
  }

  static async UpdateLanguages(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateLanguages', login, password, oldRecord);
  }

  static async DeleteLanguages(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteLanguages', login, password, null, { id });
  }
}
