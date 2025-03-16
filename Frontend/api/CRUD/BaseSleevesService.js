import ApiService from './ApiService.js';

export default class BaseSleevesService {
  static async GetBaseSleevesCount(login, password) {
    return ApiService.sendRequest('get', 'GetBaseSleevesCount', login, password);
  }

  static async GetBaseSleevesFields(login, password) {
    return ApiService.sendRequest('get', 'GetBaseSleevesFields', login, password);
  }

  static async GetBaseSleeves(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetBaseSleeves', login, password, null, { limit, page });
  }

  static async GetBaseSleevesById(id, login, password) {
    return ApiService.sendRequest('get', 'GetBaseSleevesById', login, password, null, { id });
  }

  static async CreateBaseSleeves(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateBaseSleeves', login, password, newRecord);
  }

  static async UpdateBaseSleeves(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateBaseSleeves', login, password, oldRecord);
  }

  static async DeleteBaseSleeves(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteBaseSleeves', login, password, null, { id });
  }
}
