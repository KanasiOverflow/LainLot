import ApiService from '../ApiService.js';

export default class UsersService {
  static async GetUsersCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUsersCount', login, password);
  }

  static async GetUsersFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUsersFields', login, password);
  }

  static async GetUsers(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUsers', login, password, null, { limit, page });
  }

  static async GetUsersById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUsersById', login, password, null, { id });
  }

  static async CreateUsers(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateUsers', login, password, newRecord);
  }

  static async UpdateUsers(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateUsers', login, password, oldRecord);
  }

  static async DeleteUsers(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteUsers', login, password, null, { id });
  }
}
