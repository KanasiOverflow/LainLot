import ApiService from './ApiService.js';

export default class PaymentMethodsService {
  static async GetPaymentMethodsCount(login, password) {
    return ApiService.sendRequest('get', 'GetPaymentMethodsCount', login, password);
  }

  static async GetPaymentMethodsFields(login, password) {
    return ApiService.sendRequest('get', 'GetPaymentMethodsFields', login, password);
  }

  static async GetPaymentMethods(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetPaymentMethods', login, password, null, { limit, page });
  }

  static async GetPaymentMethodsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetPaymentMethodsById', login, password, null, { id });
  }

  static async CreatePaymentMethods(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreatePaymentMethods', login, password, newRecord);
  }

  static async UpdatePaymentMethods(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdatePaymentMethods', login, password, oldRecord);
  }

  static async DeletePaymentMethods(id, login, password) {
    return ApiService.sendRequest('delete', 'DeletePaymentMethods', login, password, null, { id });
  }
}
