import ApiService from './ApiService.js';

export default class OrderStatusesService {
  static async GetOrderStatusesCount(login, password) {
    return ApiService.sendRequest('get', 'GetOrderStatusesCount', login, password);
  }

  static async GetOrderStatusesFields(login, password) {
    return ApiService.sendRequest('get', 'GetOrderStatusesFields', login, password);
  }

  static async GetOrderStatuses(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetOrderStatuses', login, password, null, { limit, page });
  }

  static async GetOrderStatusesById(id, login, password) {
    return ApiService.sendRequest('get', 'GetOrderStatusesById', login, password, null, { id });
  }

  static async CreateOrderStatuses(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateOrderStatuses', login, password, newRecord);
  }

  static async UpdateOrderStatuses(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateOrderStatuses', login, password, oldRecord);
  }

  static async DeleteOrderStatuses(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteOrderStatuses', login, password, null, { id });
  }
}
