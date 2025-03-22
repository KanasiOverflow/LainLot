import ApiService from '../ApiService.js';

export default class BaseSleevesService {
  static async GetBaseSleevesCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSleevesCount', token);
  }

  static async GetBaseSleevesFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSleevesFields', token);
  }

  static async GetBaseSleeves(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSleeves', token, null, { limit, page });
  }

  static async GetBaseSleevesById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseSleevesById', token, null, { id });
  }

  static async CreateBaseSleeves(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateBaseSleeves', token, newRecord);
  }

  static async UpdateBaseSleeves(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateBaseSleeves', token, oldRecord);
  }

  static async DeleteBaseSleeves(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteBaseSleeves', token, null, { id });
  }
}
