import ApiService from './ApiService.js';

export default class OrderHistoryService {
  static async GetOrderHistoryCount(login, password) {
    return ApiService.sendRequest('get', 'GetOrderHistoryCount', login, password);
  }

  static async GetOrderHistoryFields(login, password) {
    return ApiService.sendRequest('get', 'GetOrderHistoryFields', login, password);
  }

  static async GetOrderHistory(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetOrderHistory', login, password, null, { limit, page });
  }

  static async GetOrderHistoryById(id, login, password) {
    return ApiService.sendRequest('get', 'GetOrderHistoryById', login, password, null, { id });
  }

  static async CreateOrderHistory(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateOrderHistory', login, password, newRecord);
  }

  static async UpdateOrderHistory(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateOrderHistory', login, password, oldRecord);
  }

  static async DeleteOrderHistory(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteOrderHistory', login, password, null, { id });
  }
}
