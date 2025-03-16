import ApiService from './ApiService.js';

export default class UsersService {
  static async GetUsersCount(login, password) {
    return ApiService.sendRequest('get', 'GetUsersCount', login, password);
  }

  static async GetUsersFields(login, password) {
    return ApiService.sendRequest('get', 'GetUsersFields', login, password);
  }

  static async GetUsers(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetUsers', login, password, null, { limit, page });
  }

  static async GetUsersById(id, login, password) {
    return ApiService.sendRequest('get', 'GetUsersById', login, password, null, { id });
  }

  static async CreateUsers(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateUsers', login, password, newRecord);
  }

  static async UpdateUsers(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateUsers', login, password, oldRecord);
  }

  static async DeleteUsers(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteUsers', login, password, null, { id });
  }
}
