import ApiService from '../ApiService.js';

export default class ProductOrdersService {
  static async GetProductOrdersCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetProductOrdersCount', token);
  }

  static async GetProductOrdersFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetProductOrdersFields', token);
  }

  static async GetProductOrders(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetProductOrders', token, null, { limit, page });
  }

  static async GetProductOrdersById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetProductOrdersById', token, null, { id });
  }

  static async CreateProductOrders(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateProductOrders', token, newRecord);
  }

  static async UpdateProductOrders(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateProductOrders', token, oldRecord);
  }

  static async DeleteProductOrders(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteProductOrders', token, null, { id });
  }
}
