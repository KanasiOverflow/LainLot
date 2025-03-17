import ApiService from '../ApiService.js';

export default class OrderStatusesService {
  static async GetOrderStatusesCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetOrderStatusesCount', login, password);
  }

  static async GetOrderStatusesFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetOrderStatusesFields', login, password);
  }

  static async GetOrderStatuses(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetOrderStatuses', login, password, null, { limit, page });
  }

  static async GetOrderStatusesById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetOrderStatusesById', login, password, null, { id });
  }

  static async CreateOrderStatuses(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateOrderStatuses', login, password, newRecord);
  }

  static async UpdateOrderStatuses(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateOrderStatuses', login, password, oldRecord);
  }

  static async DeleteOrderStatuses(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteOrderStatuses', login, password, null, { id });
  }
}
