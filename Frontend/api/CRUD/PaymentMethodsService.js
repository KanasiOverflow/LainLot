import ApiService from '../ApiService.js';

export default class PaymentMethodsService {
  static async GetPaymentMethodsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentMethodsCount', login, password);
  }

  static async GetPaymentMethodsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentMethodsFields', login, password);
  }

  static async GetPaymentMethods(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentMethods', login, password, null, { limit, page });
  }

  static async GetPaymentMethodsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentMethodsById', login, password, null, { id });
  }

  static async CreatePaymentMethods(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreatePaymentMethods', login, password, newRecord);
  }

  static async UpdatePaymentMethods(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdatePaymentMethods', login, password, oldRecord);
  }

  static async DeletePaymentMethods(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeletePaymentMethods', login, password, null, { id });
  }
}
