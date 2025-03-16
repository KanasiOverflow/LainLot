import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { get200, get201 } from '../utils/responseCodes';
import { getRestAPIUrl } from '../utils/getRestAPIUrl';

export default class BaseSleevesService {
  static async GetBaseSleevesCount() {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetBaseSleevesCount`,
      auth: {
        username: secureLocalStorage.getItem('login'),
        password: secureLocalStorage.getItem('password'),
      },
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

  static async GetBaseSleevesFields() {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetBaseSleevesFields`,
      auth: {
        username: secureLocalStorage.getItem('login'),
        password: secureLocalStorage.getItem('password'),
      },
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

  static async GetBaseSleeves(limit, page) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetBaseSleeves?limit=${limit}&page=${page}`,
      auth: {
        username: secureLocalStorage.getItem('login'),
        password: secureLocalStorage.getItem('password'),
      },
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

  static async GetBaseSleevesById(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetBaseSleevesById`,
      params: { id: id },
      auth: {
        username: secureLocalStorage.getItem('login'),
        password: secureLocalStorage.getItem('password'),
      },
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

  static async CreateBaseSleeves(newRecord) {
    const options = {
      method: 'post',
      url: `${getRestAPIUrl()}/Database/CreateBaseSleeves`,
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(newRecord),
      auth: {
        username: secureLocalStorage.getItem('login'),
        password: secureLocalStorage.getItem('password'),
      },
    };

    var responseError = '';
    const response = await axios(options).catch((error) => {
      console.log(error.response.data.Message);
      responseError = error.response.data.Message;
    });

    if (response) {
      if (
        response.status === get201().Code &&
        response.statusText === get201().Message
      ) {
        return response;
      }
    } else {
      return responseError;
    }
  }

  static async UpdateBaseSleeves(oldRecord) {
    const options = {
      method: 'put',
      url: `${getRestAPIUrl()}/Database/UpdateBaseSleeves`,
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(oldRecord),
      auth: {
        username: secureLocalStorage.getItem('login'),
        password: secureLocalStorage.getItem('password'),
      },
    };

    var responseError = '';
    const response = await axios(options).catch((error) => {
      console.log(error.response.data.Message);
      responseError = error.response.data.Message;
    });

    if (response) {
      if (
        response.status === get201().Code &&
        response.statusText === get201().Message
      ) {
        return response;
      }
    } else {
      return responseError;
    }
  }

  static async DeleteBaseSleeves(id) {
    const options = {
      method: 'delete',
      url: `${getRestAPIUrl()}/Database/DeleteBaseSleeves`,
      params: { id: id },
      auth: {
        username: secureLocalStorage.getItem('login'),
        password: secureLocalStorage.getItem('password'),
      },
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
