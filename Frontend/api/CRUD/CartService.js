import ApiService from './ApiService.js';

export default class CartService {
  static async GetCartCount(login, password) {
    return ApiService.sendRequest('get', 'GetCartCount', login, password);
  }

  static async GetCartFields(login, password) {
    return ApiService.sendRequest('get', 'GetCartFields', login, password);
  }

  static async GetCart(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetCart', login, password, null, { limit, page });
  }

  static async GetCartById(id, login, password) {
    return ApiService.sendRequest('get', 'GetCartById', login, password, null, { id });
  }

  static async CreateCart(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateCart', login, password, newRecord);
  }

  static async UpdateCart(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateCart', login, password, oldRecord);
  }

  static async DeleteCart(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteCart', login, password, null, { id });
  }
}
