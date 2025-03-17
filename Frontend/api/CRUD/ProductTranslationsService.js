import ApiService from '../ApiService.js';

export default class ProductTranslationsService {
  static async GetProductTranslationsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetProductTranslationsCount', login, password);
  }

  static async GetProductTranslationsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetProductTranslationsFields', login, password);
  }

  static async GetProductTranslations(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetProductTranslations', login, password, null, { limit, page });
  }

  static async GetProductTranslationsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetProductTranslationsById', login, password, null, { id });
  }

  static async CreateProductTranslations(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateProductTranslations', login, password, newRecord);
  }

  static async UpdateProductTranslations(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateProductTranslations', login, password, oldRecord);
  }

  static async DeleteProductTranslations(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteProductTranslations', login, password, null, { id });
  }
}
