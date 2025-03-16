import ApiService from './ApiService.js';

export default class PaymentsService {
  static async GetPaymentsCount(login, password) {
    return ApiService.sendRequest('get', 'GetPaymentsCount', login, password);
  }

  static async GetPaymentsFields(login, password) {
    return ApiService.sendRequest('get', 'GetPaymentsFields', login, password);
  }

  static async GetPayments(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetPayments', login, password, null, { limit, page });
  }

  static async GetPaymentsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetPaymentsById', login, password, null, { id });
  }

  static async CreatePayments(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreatePayments', login, password, newRecord);
  }

  static async UpdatePayments(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdatePayments', login, password, oldRecord);
  }

  static async DeletePayments(id, login, password) {
    return ApiService.sendRequest('delete', 'DeletePayments', login, password, null, { id });
  }
}
