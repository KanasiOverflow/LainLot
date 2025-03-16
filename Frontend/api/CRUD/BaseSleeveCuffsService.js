import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { get200, get201 } from '../utils/responseCodes';
import { getRestAPIUrl } from '../utils/getRestAPIUrl';

export default class BaseSleeveCuffsService {
  static async GetBaseSleeveCuffsCount() {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetBaseSleeveCuffsCount`,
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

  static async GetBaseSleeveCuffsFields() {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetBaseSleeveCuffsFields`,
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

  static async GetBaseSleeveCuffs(limit, page) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetBaseSleeveCuffs?limit=${limit}&page=${page}`,
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

  static async GetBaseSleeveCuffsById(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetBaseSleeveCuffsById`,
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

  static async CreateBaseSleeveCuffs(newRecord) {
    const options = {
      method: 'post',
      url: `${getRestAPIUrl()}/Database/CreateBaseSleeveCuffs`,
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

  static async UpdateBaseSleeveCuffs(oldRecord) {
    const options = {
      method: 'put',
      url: `${getRestAPIUrl()}/Database/UpdateBaseSleeveCuffs`,
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

  static async DeleteBaseSleeveCuffs(id) {
    const options = {
      method: 'delete',
      url: `${getRestAPIUrl()}/Database/DeleteBaseSleeveCuffs`,
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
