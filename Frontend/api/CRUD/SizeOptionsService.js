import ApiService from '../ApiService.js';

export default class SizeOptionsService {
  static async GetSizeOptionsCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetSizeOptionsCount', token);
  }

  static async GetSizeOptionsFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetSizeOptionsFields', token);
  }

  static async GetSizeOptions(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetSizeOptions', token, null, { limit, page });
  }

  static async GetSizeOptionsById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetSizeOptionsById', token, null, { id });
  }

  static async CreateSizeOptions(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateSizeOptions', token, newRecord);
  }

  static async UpdateSizeOptions(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateSizeOptions', token, oldRecord);
  }

  static async DeleteSizeOptions(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteSizeOptions', token, null, { id });
  }
}
