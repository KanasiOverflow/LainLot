import ApiService from '../ApiService.js';

export default class CartService {
  static async GetCartCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCartCount', login, password);
  }

  static async GetCartFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCartFields', login, password);
  }

  static async GetCart(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCart', login, password, null, { limit, page });
  }

  static async GetCartById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetCartById', login, password, null, { id });
  }

  static async CreateCart(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateCart', login, password, newRecord);
  }

  static async UpdateCart(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCart', login, password, oldRecord);
  }

  static async DeleteCart(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCart', login, password, null, { id });
  }
}
