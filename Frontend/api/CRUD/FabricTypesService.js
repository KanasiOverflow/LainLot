import ApiService from './ApiService.js';

export default class FabricTypesService {
  static async GetFabricTypesCount(login, password) {
    return ApiService.sendRequest('get', 'GetFabricTypesCount', login, password);
  }

  static async GetFabricTypesFields(login, password) {
    return ApiService.sendRequest('get', 'GetFabricTypesFields', login, password);
  }

  static async GetFabricTypes(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetFabricTypes', login, password, null, { limit, page });
  }

  static async GetFabricTypesById(id, login, password) {
    return ApiService.sendRequest('get', 'GetFabricTypesById', login, password, null, { id });
  }

  static async CreateFabricTypes(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateFabricTypes', login, password, newRecord);
  }

  static async UpdateFabricTypes(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateFabricTypes', login, password, oldRecord);
  }

  static async DeleteFabricTypes(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteFabricTypes', login, password, null, { id });
  }
}
