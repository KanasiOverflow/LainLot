import ApiService from '../ApiService.js';

export default class ProductImagesService {
  static async GetProductImagesCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetProductImagesCount', login, password);
  }

  static async GetProductImagesFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetProductImagesFields', login, password);
  }

  static async GetProductImages(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetProductImages', login, password, null, { limit, page });
  }

  static async GetProductImagesById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetProductImagesById', login, password, null, { id });
  }

  static async CreateProductImages(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateProductImages', login, password, newRecord);
  }

  static async UpdateProductImages(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateProductImages', login, password, oldRecord);
  }

  static async DeleteProductImages(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteProductImages', login, password, null, { id });
  }
}
