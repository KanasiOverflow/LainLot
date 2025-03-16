import ApiService from './ApiService.js';

export default class ProductsService {
  static async GetProductsCount(login, password) {
    return ApiService.sendRequest('get', 'GetProductsCount', login, password);
  }

  static async GetProductsFields(login, password) {
    return ApiService.sendRequest('get', 'GetProductsFields', login, password);
  }

  static async GetProducts(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetProducts', login, password, null, { limit, page });
  }

  static async GetProductsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetProductsById', login, password, null, { id });
  }

  static async CreateProducts(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateProducts', login, password, newRecord);
  }

  static async UpdateProducts(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateProducts', login, password, oldRecord);
  }

  static async DeleteProducts(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteProducts', login, password, null, { id });
  }
}
