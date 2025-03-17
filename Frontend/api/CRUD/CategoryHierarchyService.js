import ApiService from '../ApiService.js';

export default class CategoryHierarchyService {
  static async GetCategoryHierarchyCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCategoryHierarchyCount', login, password);
  }

  static async GetCategoryHierarchyFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCategoryHierarchyFields', login, password);
  }

  static async GetCategoryHierarchy(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCategoryHierarchy', login, password, null, { limit, page });
  }

  static async GetCategoryHierarchyById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCategoryHierarchyById', login, password, null, { id });
  }

  static async CreateCategoryHierarchy(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateCategoryHierarchy', login, password, newRecord);
  }

  static async UpdateCategoryHierarchy(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCategoryHierarchy', login, password, oldRecord);
  }

  static async DeleteCategoryHierarchy(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCategoryHierarchy', login, password, null, { id });
  }
}
