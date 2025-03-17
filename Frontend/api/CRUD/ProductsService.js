import ApiService from '../ApiService.js';

export default class ProductsService {
  static async GetProductsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetProductsCount', login, password);
  }

  static async GetProductsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetProductsFields', login, password);
  }

  static async GetProducts(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetProducts', login, password, null, { limit, page });
  }

  static async GetProductsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetProductsById', login, password, null, { id });
  }

  static async CreateProducts(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateProducts', login, password, newRecord);
  }

  static async UpdateProducts(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateProducts', login, password, oldRecord);
  }

  static async DeleteProducts(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteProducts', login, password, null, { id });
  }
}
