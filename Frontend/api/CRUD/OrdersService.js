import ApiService from '../ApiService.js';

export default class OrdersService {
  static async GetOrdersCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetOrdersCount', login, password);
  }

  static async GetOrdersFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetOrdersFields', login, password);
  }

  static async GetOrders(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetOrders', login, password, null, { limit, page });
  }

  static async GetOrdersById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetOrdersById', login, password, null, { id });
  }

  static async CreateOrders(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateOrders', login, password, newRecord);
  }

  static async UpdateOrders(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateOrders', login, password, oldRecord);
  }

  static async DeleteOrders(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteOrders', login, password, null, { id });
  }
}
