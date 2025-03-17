import ApiService from '../ApiService.js';

export default class BaseBeltsService {
  static async GetBaseBeltsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseBeltsCount', login, password);
  }

  static async GetBaseBeltsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseBeltsFields', login, password);
  }

  static async GetBaseBelts(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseBelts', login, password, null, { limit, page });
  }

  static async GetBaseBeltsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBaseBeltsById', login, password, null, { id });
  }

  static async CreateBaseBelts(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateBaseBelts', login, password, newRecord);
  }

  static async UpdateBaseBelts(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateBaseBelts', login, password, oldRecord);
  }

  static async DeleteBaseBelts(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteBaseBelts', login, password, null, { id });
  }
}
