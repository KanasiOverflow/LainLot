import axios from 'axios';
import { get200 } from '../utils/responseCodes';
import { getRestAPIUrl } from '../utils/getRestAPIUrl';

export default class AboutPageService {
  // AllowAnonymous
  static async GetAbout(lang) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Atelier/GetAbout`,
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
