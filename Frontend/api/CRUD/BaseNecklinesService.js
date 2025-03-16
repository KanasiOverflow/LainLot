import ApiService from './ApiService.js';

export default class BaseNecklinesService {
  static async GetBaseNecklinesCount(login, password) {
    return ApiService.sendRequest('get', 'GetBaseNecklinesCount', login, password);
  }

  static async GetBaseNecklinesFields(login, password) {
    return ApiService.sendRequest('get', 'GetBaseNecklinesFields', login, password);
  }

  static async GetBaseNecklines(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetBaseNecklines', login, password, null, { limit, page });
  }

  static async GetBaseNecklinesById(id, login, password) {
    return ApiService.sendRequest('get', 'GetBaseNecklinesById', login, password, null, { id });
  }

  static async CreateBaseNecklines(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateBaseNecklines', login, password, newRecord);
  }

  static async UpdateBaseNecklines(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateBaseNecklines', login, password, oldRecord);
  }

  static async DeleteBaseNecklines(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteBaseNecklines', login, password, null, { id });
  }
}
