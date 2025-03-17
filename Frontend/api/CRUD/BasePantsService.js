import ApiService from '../ApiService.js';

export default class BasePantsService {
  static async GetBasePantsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBasePantsCount', login, password);
  }

  static async GetBasePantsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBasePantsFields', login, password);
  }

  static async GetBasePants(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBasePants', login, password, null, { limit, page });
  }

  static async GetBasePantsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetBasePantsById', login, password, null, { id });
  }

  static async CreateBasePants(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateBasePants', login, password, newRecord);
  }

  static async UpdateBasePants(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateBasePants', login, password, oldRecord);
  }

  static async DeleteBasePants(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteBasePants', login, password, null, { id });
  }
}
