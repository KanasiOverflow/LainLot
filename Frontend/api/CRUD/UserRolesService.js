import ApiService from '../ApiService.js';

export default class UserRolesService {
  static async GetUserRolesCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUserRolesCount', login, password);
  }

  static async GetUserRolesFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUserRolesFields', login, password);
  }

  static async GetUserRoles(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUserRoles', login, password, null, { limit, page });
  }

  static async GetUserRolesById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUserRolesById', login, password, null, { id });
  }

  static async CreateUserRoles(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateUserRoles', login, password, newRecord);
  }

  static async UpdateUserRoles(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateUserRoles', login, password, oldRecord);
  }

  static async DeleteUserRoles(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteUserRoles', login, password, null, { id });
  }
}
