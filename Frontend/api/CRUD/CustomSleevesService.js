import ApiService from './ApiService.js';

export default class CustomSleevesService {
  static async GetCustomSleevesCount(login, password) {
    return ApiService.sendRequest('get', 'GetCustomSleevesCount', login, password);
  }

  static async GetCustomSleevesFields(login, password) {
    return ApiService.sendRequest('get', 'GetCustomSleevesFields', login, password);
  }

  static async GetCustomSleeves(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetCustomSleeves', login, password, null, { limit, page });
  }

  static async GetCustomSleevesById(id, login, password) {
    return ApiService.sendRequest('get', 'GetCustomSleevesById', login, password, null, { id });
  }

  static async CreateCustomSleeves(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateCustomSleeves', login, password, newRecord);
  }

  static async UpdateCustomSleeves(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateCustomSleeves', login, password, oldRecord);
  }

  static async DeleteCustomSleeves(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteCustomSleeves', login, password, null, { id });
  }
}
