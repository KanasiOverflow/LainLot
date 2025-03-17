import ApiService from '../ApiService.js';

export default class PaymentsService {
  static async GetPaymentsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentsCount', login, password);
  }

  static async GetPaymentsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentsFields', login, password);
  }

  static async GetPayments(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetPayments', login, password, null, { limit, page });
  }

  static async GetPaymentsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentsById', login, password, null, { id });
  }

  static async CreatePayments(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreatePayments', login, password, newRecord);
  }

  static async UpdatePayments(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdatePayments', login, password, oldRecord);
  }

  static async DeletePayments(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeletePayments', login, password, null, { id });
  }
}
