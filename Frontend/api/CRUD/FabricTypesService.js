import ApiService from '../ApiService.js';

export default class FabricTypesService {
  static async GetFabricTypesCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFabricTypesCount', login, password);
  }

  static async GetFabricTypesFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFabricTypesFields', login, password);
  }

  static async GetFabricTypes(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFabricTypes', login, password, null, { limit, page });
  }

  static async GetFabricTypesById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFabricTypesById', login, password, null, { id });
  }

  static async CreateFabricTypes(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateFabricTypes', login, password, newRecord);
  }

  static async UpdateFabricTypes(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateFabricTypes', login, password, oldRecord);
  }

  static async DeleteFabricTypes(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteFabricTypes', login, password, null, { id });
  }
}
