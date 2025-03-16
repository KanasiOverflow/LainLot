import ApiService from './ApiService.js';

export default class AboutService {
  static async GetAboutCount(login, password) {
    return ApiService.sendRequest('get', 'GetAboutCount', login, password);
  }

  static async GetAboutFields(login, password) {
    return ApiService.sendRequest('get', 'GetAboutFields', login, password);
  }

  static async GetAbout(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetAbout', login, password, null, { limit, page });
  }

  static async GetAboutById(id, login, password) {
    return ApiService.sendRequest('get', 'GetAboutById', login, password, null, { id });
  }

  static async CreateAbout(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateAbout', login, password, newRecord);
  }

  static async UpdateAbout(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateAbout', login, password, oldRecord);
  }

  static async DeleteAbout(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteAbout', login, password, null, { id });
  }
}