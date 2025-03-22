import ApiService from '../ApiService.js';

export default class ProductsService {
  static async GetProductsCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetProductsCount', token);
  }

  static async GetProductsFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetProductsFields', token);
  }

  static async GetProducts(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetProducts', token, null, { limit, page });
  }

  static async GetProductsById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetProductsById', token, null, { id });
  }

  static async CreateProducts(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateProducts', token, newRecord);
  }

  static async UpdateProducts(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateProducts', token, oldRecord);
  }

  static async DeleteProducts(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteProducts', token, null, { id });
  }
}
