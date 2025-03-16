import ApiService from './ApiService.js';

export default class ContactsService {
  static async GetContactsCount(login, password) {
    return ApiService.sendRequest('get', 'GetContactsCount', login, password);
  }

  static async GetContactsFields(login, password) {
    return ApiService.sendRequest('get', 'GetContactsFields', login, password);
  }

  static async GetContacts(limit, page, login, password) {
    return ApiService.sendRequest('get', 'GetContacts', login, password, null, { limit, page });
  }

  static async GetContactsById(id, login, password) {
    return ApiService.sendRequest('get', 'GetContactsById', login, password, null, { id });
  }

  static async CreateContacts(newRecord, login, password) {
    return ApiService.sendRequest('post', 'CreateContacts', login, password, newRecord);
  }

  static async UpdateContacts(oldRecord, login, password) {
    return ApiService.sendRequest('put', 'UpdateContacts', login, password, oldRecord);
  }

  static async DeleteContacts(id, login, password) {
    return ApiService.sendRequest('delete', 'DeleteContacts', login, password, null, { id });
  }
}
