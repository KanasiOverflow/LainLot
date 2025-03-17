import ApiService from '../ApiService.js';

export default class OrderHistoryService {
  static async GetOrderHistoryCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetOrderHistoryCount', login, password);
  }

  static async GetOrderHistoryFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetOrderHistoryFields', login, password);
  }

  static async GetOrderHistory(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetOrderHistory', login, password, null, { limit, page });
  }

  static async GetOrderHistoryById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetOrderHistoryById', login, password, null, { id });
  }

  static async CreateOrderHistory(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateOrderHistory', login, password, newRecord);
  }

  static async UpdateOrderHistory(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateOrderHistory', login, password, oldRecord);
  }

  static async DeleteOrderHistory(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteOrderHistory', login, password, null, { id });
  }
}
