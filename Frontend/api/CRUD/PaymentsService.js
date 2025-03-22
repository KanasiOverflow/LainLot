import ApiService from '../ApiService.js';

export default class PaymentsService {
  static async GetPaymentsCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentsCount', token);
  }

  static async GetPaymentsFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentsFields', token);
  }

  static async GetPayments(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetPayments', token, null, { limit, page });
  }

  static async GetPaymentsById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentsById', token, null, { id });
  }

  static async CreatePayments(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreatePayments', token, newRecord);
  }

  static async UpdatePayments(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdatePayments', token, oldRecord);
  }

  static async DeletePayments(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeletePayments', token, null, { id });
  }
}
