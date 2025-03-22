import ApiService from '../ApiService.js';

export default class ContactsService {
  static async GetContactsCount(token) {
    return ApiService.sendRequest('get', 'Database', 'GetContactsCount', token);
  }

  static async GetContactsFields(token) {
    return ApiService.sendRequest('get', 'Database', 'GetContactsFields', token);
  }

  static async GetContacts(limit, page, token) {
    return ApiService.sendRequest('get', 'Database', 'GetContacts', token, null, { limit, page });
  }

  static async GetContactsById(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetContactsById', token, null, { id });
  }

  static async CreateContacts(newRecord, token) {
    return ApiService.sendRequest('post', 'Database', 'CreateContacts', token, newRecord);
  }

  static async UpdateContacts(oldRecord, token) {
    return ApiService.sendRequest('put', 'Database', 'UpdateContacts', token, oldRecord);
  }

  static async DeleteContacts(id, token) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteContacts', token, null, { id });
  }
}
