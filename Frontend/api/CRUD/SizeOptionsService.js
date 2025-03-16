import ApiService from './ApiService.js';

export default class SizeOptionsService {
  static async GetSizeOptionsCount(login, password) {
    return ApiService.sendRequest('get', 'GetSizeOptionsCount', login, password);
  }

  static async GetSizeOptionsFields(login, password) {
    return ApiService.sendRequest('get', 'GetSizeOptionsFields', login, password);
  }

  static async GetSizeOptions(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetSizeOptions', login, password, null, { limit, page });
  }

  static async GetSizeOptionsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetSizeOptionsById', login, password, null, { id });
  }

  static async CreateSizeOptions(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateSizeOptions', login, password, newRecord);
  }

  static async UpdateSizeOptions(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateSizeOptions', login, password, oldRecord);
  }

  static async DeleteSizeOptions(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteSizeOptions', login, password, null, { id });
  }
}
