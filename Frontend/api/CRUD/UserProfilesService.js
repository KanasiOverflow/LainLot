import ApiService from '../ApiService.js';

export default class UserProfilesService {
  static async GetUserProfilesCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUserProfilesCount', login, password);
  }

  static async GetUserProfilesFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUserProfilesFields', login, password);
  }

  static async GetUserProfiles(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUserProfiles', login, password, null, { limit, page });
  }

  static async GetUserProfilesById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetUserProfilesById', login, password, null, { id });
  }

  static async CreateUserProfiles(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateUserProfiles', login, password, newRecord);
  }

  static async UpdateUserProfiles(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateUserProfiles', login, password, oldRecord);
  }

  static async DeleteUserProfiles(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteUserProfiles', login, password, null, { id });
  }
}
