import ApiService from '../ApiService.js';

export default class BasePantsService {
  static async GetBasePantsCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetBasePantsCount', token);
  }

  static async GetBasePantsFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetBasePantsFields', token);
  }

  static async GetBasePants(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetBasePants', token, null, { limit, page });
  }

  static async GetBasePantsById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetBasePantsById', token, null, { id });
  }

  static async CreateBasePants(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateBasePants', token, newRecord);
  }

  static async UpdateBasePants(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateBasePants', token, oldRecord);
  }

  static async DeleteBasePants(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteBasePants', token, null, { id });
  }
}
