import ApiService from '../ApiService.js';

export default class UserProfilesService {
  static async GetUserProfilesCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetUserProfilesCount', token);
  }

  static async GetUserProfilesFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetUserProfilesFields', token);
  }

  static async GetUserProfiles(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetUserProfiles', token, null, { limit, page });
  }

  static async GetUserProfilesById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetUserProfilesById', token, null, { id });
  }

  static async CreateUserProfiles(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateUserProfiles', token, newRecord);
  }

  static async UpdateUserProfiles(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateUserProfiles', token, oldRecord);
  }

  static async DeleteUserProfiles(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteUserProfiles', token, null, { id });
  }
}
