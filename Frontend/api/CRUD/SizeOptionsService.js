import ApiService from '../ApiService.js';

export default class SizeOptionsService {
  static async GetSizeOptionsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetSizeOptionsCount', login, password);
  }

  static async GetSizeOptionsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetSizeOptionsFields', login, password);
  }

  static async GetSizeOptions(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetSizeOptions', login, password, null, { limit, page });
  }

  static async GetSizeOptionsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetSizeOptionsById', login, password, null, { id });
  }

  static async CreateSizeOptions(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateSizeOptions', login, password, newRecord);
  }

  static async UpdateSizeOptions(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateSizeOptions', login, password, oldRecord);
  }

  static async DeleteSizeOptions(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteSizeOptions', login, password, null, { id });
  }
}
