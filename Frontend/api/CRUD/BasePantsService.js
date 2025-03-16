import ApiService from './ApiService.js';

export default class BasePantsService {
  static async GetBasePantsCount(login, password) {
    return ApiService.sendRequest('get', 'GetBasePantsCount', login, password);
  }

  static async GetBasePantsFields(login, password) {
    return ApiService.sendRequest('get', 'GetBasePantsFields', login, password);
  }

  static async GetBasePants(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetBasePants', login, password, null, { limit, page });
  }

  static async GetBasePantsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetBasePantsById', login, password, null, { id });
  }

  static async CreateBasePants(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateBasePants', login, password, newRecord);
  }

  static async UpdateBasePants(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateBasePants', login, password, oldRecord);
  }

  static async DeleteBasePants(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteBasePants', login, password, null, { id });
  }
}
