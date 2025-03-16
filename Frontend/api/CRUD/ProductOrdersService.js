import ApiService from './ApiService.js';

export default class ProductOrdersService {
  static async GetProductOrdersCount(login, password) {
    return ApiService.sendRequest('get', 'GetProductOrdersCount', login, password);
  }

  static async GetProductOrdersFields(login, password) {
    return ApiService.sendRequest('get', 'GetProductOrdersFields', login, password);
  }

  static async GetProductOrders(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetProductOrders', login, password, null, { limit, page });
  }

  static async GetProductOrdersById(id, login, password) {
    return ApiService.sendRequest('get', 'GetProductOrdersById', login, password, null, { id });
  }

  static async CreateProductOrders(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateProductOrders', login, password, newRecord);
  }

  static async UpdateProductOrders(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateProductOrders', login, password, oldRecord);
  }

  static async DeleteProductOrders(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteProductOrders', login, password, null, { id });
  }
}
