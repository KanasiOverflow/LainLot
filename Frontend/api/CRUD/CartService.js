import ApiService from '../ApiService.js';

export default class CartService {
  static async GetCartCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetCartCount', token);
  }

  static async GetCartFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetCartFields', token);
  }

  static async GetCart(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetCart', token, null, { limit, page });
  }

  static async GetCartById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetCartById', token, null, { id });
  }

  static async CreateCart(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateCart', token, newRecord);
  }

  static async UpdateCart(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateCart', token, oldRecord);
  }

  static async DeleteCart(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteCart', token, null, { id });
  }
}
