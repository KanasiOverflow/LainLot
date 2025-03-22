import ApiService from '../ApiService.js';

export default class PaymentMethodsService {
  static async GetPaymentMethodsCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentMethodsCount', token);
  }

  static async GetPaymentMethodsFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentMethodsFields', token);
  }

  static async GetPaymentMethods(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentMethods', token, null, { limit, page });
  }

  static async GetPaymentMethodsById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentMethodsById', token, null, { id });
  }

  static async CreatePaymentMethods(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreatePaymentMethods', token, newRecord);
  }

  static async UpdatePaymentMethods(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdatePaymentMethods', token, oldRecord);
  }

  static async DeletePaymentMethods(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeletePaymentMethods', token, null, { id });
  }
}
