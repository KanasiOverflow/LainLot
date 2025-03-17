import ApiService from '../ApiService.js';

export default class UserOrderHistoryService {
  static async GetUserOrderHistoryCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUserOrderHistoryCount', login, password);
  }

  static async GetUserOrderHistoryFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUserOrderHistoryFields', login, password);
  }

  static async GetUserOrderHistory(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUserOrderHistory', login, password, null, { limit, page });
  }

  static async GetUserOrderHistoryById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUserOrderHistoryById', login, password, null, { id });
  }

  static async CreateUserOrderHistory(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateUserOrderHistory', login, password, newRecord);
  }

  static async UpdateUserOrderHistory(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateUserOrderHistory', login, password, oldRecord);
  }

  static async DeleteUserOrderHistory(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteUserOrderHistory', login, password, null, { id });
  }
}
