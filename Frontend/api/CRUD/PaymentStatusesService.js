import ApiService from '../ApiService.js';

export default class PaymentStatusesService {
  static async GetPaymentStatusesCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentStatusesCount', login, password);
  }

  static async GetPaymentStatusesFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentStatusesFields', login, password);
  }

  static async GetPaymentStatuses(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentStatuses', login, password, null, { limit, page });
  }

  static async GetPaymentStatusesById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetPaymentStatusesById', login, password, null, { id });
  }

  static async CreatePaymentStatuses(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreatePaymentStatuses', login, password, newRecord);
  }

  static async UpdatePaymentStatuses(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdatePaymentStatuses', login, password, oldRecord);
  }

  static async DeletePaymentStatuses(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeletePaymentStatuses', login, password, null, { id });
  }
}
