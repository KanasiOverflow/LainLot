import ApiService from './ApiService.js';

export default class ProductTranslationsService {
  static async GetProductTranslationsCount(login, password) {
    return ApiService.sendRequest('get', 'GetProductTranslationsCount', login, password);
  }

  static async GetProductTranslationsFields(login, password) {
    return ApiService.sendRequest('get', 'GetProductTranslationsFields', login, password);
  }

  static async GetProductTranslations(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetProductTranslations', login, password, null, { limit, page });
  }

  static async GetProductTranslationsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetProductTranslationsById', login, password, null, { id });
  }

  static async CreateProductTranslations(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateProductTranslations', login, password, newRecord);
  }

  static async UpdateProductTranslations(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateProductTranslations', login, password, oldRecord);
  }

  static async DeleteProductTranslations(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteProductTranslations', login, password, null, { id });
  }
}
