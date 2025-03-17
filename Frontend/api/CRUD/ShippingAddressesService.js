import ApiService from '../ApiService.js';

export default class ShippingAddressesService {
  static async GetShippingAddressesCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetShippingAddressesCount', login, password);
  }

  static async GetShippingAddressesFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetShippingAddressesFields', login, password);
  }

  static async GetShippingAddresses(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetShippingAddresses', login, password, null, { limit, page });
  }

  static async GetShippingAddressesById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetShippingAddressesById', login, password, null, { id });
  }

  static async CreateShippingAddresses(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateShippingAddresses', login, password, newRecord);
  }

  static async UpdateShippingAddresses(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateShippingAddresses', login, password, oldRecord);
  }

  static async DeleteShippingAddresses(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteShippingAddresses', login, password, null, { id });
  }
}
