import ApiService from '../ApiService.js';

export default class CustomizableProductsService {
  static async GetCustomizableProductsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomizableProductsCount', login, password);
  }

  static async GetCustomizableProductsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomizableProductsFields', login, password);
  }

  static async GetCustomizableProducts(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomizableProducts', login, password, null, { limit, page });
  }

  static async GetCustomizableProductsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCustomizableProductsById', login, password, null, { id });
  }

  static async CreateCustomizableProducts(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateCustomizableProducts', login, password, newRecord);
  }

  static async UpdateCustomizableProducts(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCustomizableProducts', login, password, oldRecord);
  }

  static async DeleteCustomizableProducts(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCustomizableProducts', login, password, null, { id });
  }
}
