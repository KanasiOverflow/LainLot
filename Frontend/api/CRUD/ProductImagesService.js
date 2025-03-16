import ApiService from './ApiService.js';

export default class ProductImagesService {
  static async GetProductImagesCount(login, password) {
    return ApiService.sendRequest('get', 'GetProductImagesCount', login, password);
  }

  static async GetProductImagesFields(login, password) {
    return ApiService.sendRequest('get', 'GetProductImagesFields', login, password);
  }

  static async GetProductImages(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetProductImages', login, password, null, { limit, page });
  }

  static async GetProductImagesById(id, login, password) {
    return ApiService.sendRequest('get', 'GetProductImagesById', login, password, null, { id });
  }

  static async CreateProductImages(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateProductImages', login, password, newRecord);
  }

  static async UpdateProductImages(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateProductImages', login, password, oldRecord);
  }

  static async DeleteProductImages(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteProductImages', login, password, null, { id });
  }
}
