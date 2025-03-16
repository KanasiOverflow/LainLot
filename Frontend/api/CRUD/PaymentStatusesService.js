import ApiService from './ApiService.js';

export default class PaymentStatusesService {
  static async GetPaymentStatusesCount(login, password) {
    return ApiService.sendRequest('get', 'GetPaymentStatusesCount', login, password);
  }

  static async GetPaymentStatusesFields(login, password) {
    return ApiService.sendRequest('get', 'GetPaymentStatusesFields', login, password);
  }

  static async GetPaymentStatuses(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetPaymentStatuses', login, password, null, { limit, page });
  }

  static async GetPaymentStatusesById(id, login, password) {
    return ApiService.sendRequest('get', 'GetPaymentStatusesById', login, password, null, { id });
  }

  static async CreatePaymentStatuses(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreatePaymentStatuses', login, password, newRecord);
  }

  static async UpdatePaymentStatuses(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdatePaymentStatuses', login, password, oldRecord);
  }

  static async DeletePaymentStatuses(id, login, password) {
    return ApiService.sendRequest('delete', 'DeletePaymentStatuses', login, password, null, { id });
  }
}
