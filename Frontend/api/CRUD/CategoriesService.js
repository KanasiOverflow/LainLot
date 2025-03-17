import ApiService from '../ApiService.js';

export default class CategoriesService {
  static async GetCategoriesCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCategoriesCount', login, password);
  }

  static async GetCategoriesFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCategoriesFields', login, password);
  }

  static async GetCategories(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCategories', login, password, null, { limit, page });
  }

  static async GetCategoriesById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCategoriesById', login, password, null, { id });
  }

  static async CreateCategories(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateCategories', login, password, newRecord);
  }

  static async UpdateCategories(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCategories', login, password, oldRecord);
  }

  static async DeleteCategories(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCategories', login, password, null, { id });
  }
}
