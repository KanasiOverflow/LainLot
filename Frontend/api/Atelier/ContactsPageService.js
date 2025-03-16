import axios from 'axios';
import { get200 } from '../utils/responseCodes.js';
import { getRestAPIUrl } from '../utils/getRestAPIUrl.js';

export default class ContactsPageService {
  // AllowAnonymous
  static async GetContacts(lang) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Atelier/GetContacts`,
      params: { lang: lang },
    };
    const response = await axios(options);
    if (
      response.status === get200().Code &&
      response.statusText === get200().Message
    ) {
      return response;
    }
    return null;
  }
}
