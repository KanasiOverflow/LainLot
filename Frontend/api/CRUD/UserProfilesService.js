import ApiService from './ApiService.js';

export default class UserProfilesService {
  static async GetUserProfilesCount(login, password) {
    return ApiService.sendRequest('get', 'GetUserProfilesCount', login, password);
  }

  static async GetUserProfilesFields(login, password) {
    return ApiService.sendRequest('get', 'GetUserProfilesFields', login, password);
  }

  static async GetUserProfiles(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetUserProfiles', login, password, null, { limit, page });
  }

  static async GetUserProfilesById(id, login, password) {
    return ApiService.sendRequest('get', 'GetUserProfilesById', login, password, null, { id });
  }

  static async CreateUserProfiles(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateUserProfiles', login, password, newRecord);
  }

  static async UpdateUserProfiles(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateUserProfiles', login, password, oldRecord);
  }

  static async DeleteUserProfiles(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteUserProfiles', login, password, null, { id });
  }
}
