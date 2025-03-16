import ApiService from './ApiService.js';

export default class UserOrderHistoryService {
  static async GetUserOrderHistoryCount(login, password) {
    return ApiService.sendRequest('get', 'GetUserOrderHistoryCount', login, password);
  }

  static async GetUserOrderHistoryFields(login, password) {
    return ApiService.sendRequest('get', 'GetUserOrderHistoryFields', login, password);
  }

  static async GetUserOrderHistory(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetUserOrderHistory', login, password, null, { limit, page });
  }

  static async GetUserOrderHistoryById(id, login, password) {
    return ApiService.sendRequest('get', 'GetUserOrderHistoryById', login, password, null, { id });
  }

  static async CreateUserOrderHistory(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateUserOrderHistory', login, password, newRecord);
  }

  static async UpdateUserOrderHistory(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateUserOrderHistory', login, password, oldRecord);
  }

  static async DeleteUserOrderHistory(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteUserOrderHistory', login, password, null, { id });
  }
}
