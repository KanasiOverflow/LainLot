import ApiService from './ApiService.js';

export default class CategoryHierarchyService {
  static async GetCategoryHierarchyCount(login, password) {
    return ApiService.sendRequest('get', 'GetCategoryHierarchyCount', login, password);
  }

  static async GetCategoryHierarchyFields(login, password) {
    return ApiService.sendRequest('get', 'GetCategoryHierarchyFields', login, password);
  }

  static async GetCategoryHierarchy(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetCategoryHierarchy', login, password, null, { limit, page });
  }

  static async GetCategoryHierarchyById(id, login, password) {
    return ApiService.sendRequest('get', 'GetCategoryHierarchyById', login, password, null, { id });
  }

  static async CreateCategoryHierarchy(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateCategoryHierarchy', login, password, newRecord);
  }

  static async UpdateCategoryHierarchy(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateCategoryHierarchy', login, password, oldRecord);
  }

  static async DeleteCategoryHierarchy(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteCategoryHierarchy', login, password, null, { id });
  }
}
