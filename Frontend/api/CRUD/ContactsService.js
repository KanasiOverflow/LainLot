import ApiService from '../ApiService.js';

export default class ContactsService {
  static async GetContactsCount(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetContactsCount', login, password);
  }

  static async GetContactsFields(login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetContactsFields', login, password);
  }

  static async GetContacts(limit, page, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetContacts', login, password, null, { limit, page });
  }

  static async GetContactsById(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetContactsById', login, password, null, { id });
  }

  static async CreateContacts(newRecord, login, password) {
    return ApiService.sendRequest('post', 'Database', 'CreateContacts', login, password, newRecord);
  }

  static async UpdateContacts(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'Database', 'UpdateContacts', login, password, oldRecord);
  }

  static async DeleteContacts(id, login, password) {
    return ApiService.sendRequest('delete', 'Database', 'DeleteContacts', login, password, null, { id });
  }
}
