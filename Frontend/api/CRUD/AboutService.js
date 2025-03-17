import ApiService from '../ApiService.js';

export default class AboutService {
  static async GetAboutCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetAboutCount', login, password);
  }

  static async GetAboutFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetAboutFields', login, password);
  }

  static async GetAbout(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetAbout', login, password, null, { limit, page });
  }

  static async GetAboutById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetAboutById', login, password, null, { id });
  }

  static async CreateAbout(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateAbout', login, password, newRecord);
  }

  static async UpdateAbout(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateAbout', login, password, oldRecord);
  }

  static async DeleteAbout(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteAbout', login, password, null, { id });
  }
}