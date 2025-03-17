import ApiService from '../ApiService.js';

export default class AboutPageService {
  // AllowAnonymous
  static async GetAbout(lang) {
    try {
      return await ApiService.sendRequest('get', 'Atelier', 'GetAbout', null, null, null, { lang });
    } catch (error) {
      console.error(`Error fetching About page data:`, error);
      return null;
    }
  }
}
