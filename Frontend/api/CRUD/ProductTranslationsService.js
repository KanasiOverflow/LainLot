import ApiService from '../ApiService.js';

export default class ProductTranslationsService {
  static async GetProductTranslationsCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetProductTranslationsCount', token);
  }

  static async GetProductTranslationsFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetProductTranslationsFields', token);
  }

  static async GetProductTranslations(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetProductTranslations', token, null, { limit, page });
  }

  static async GetProductTranslationsById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetProductTranslationsById', token, null, { id });
  }

  static async CreateProductTranslations(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateProductTranslations', token, newRecord);
  }

  static async UpdateProductTranslations(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateProductTranslations', token, oldRecord);
  }

  static async DeleteProductTranslations(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteProductTranslations', token, null, { id });
  }
}
