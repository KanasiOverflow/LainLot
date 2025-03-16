import ApiService from './ApiService.js';

export default class CategoriesService {
  static async GetCategoriesCount(login, password) {
    return ApiService.sendRequest('get', 'GetCategoriesCount', login, password);
  }

  static async GetCategoriesFields(login, password) {
    return ApiService.sendRequest('get', 'GetCategoriesFields', login, password);
  }

  static async GetCategories(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetCategories', login, password, null, { limit, page });
  }

  static async GetCategoriesById(id, login, password) {
    return ApiService.sendRequest('get', 'GetCategoriesById', login, password, null, { id });
  }

  static async CreateCategories(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateCategories', login, password, newRecord);
  }

  static async UpdateCategories(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateCategories', login, password, oldRecord);
  }

  static async DeleteCategories(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteCategories', login, password, null, { id });
  }
}
