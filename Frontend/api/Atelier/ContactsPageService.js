import ApiService from '../ApiService.js';

export default class ContactsPageService {
  // AllowAnonymous
  static async GetContacts(lang) {
    try {
      return await ApiService.sendRequest('get', 'Atelier', 'GetContacts', null, null, null, { lang });
    } catch (error) {
      console.error(`Error fetching Contacts page data:`, error);
      return null;
    }
  }
}
