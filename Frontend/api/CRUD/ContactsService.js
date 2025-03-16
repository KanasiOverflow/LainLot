import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { get200, get201 } from '../utils/responseCodes.js';
import { getRestAPIUrl } from '../utils/getRestAPIUrl.js';

export default class ContactsService {
  static async GetContactsCount() {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetContactsCount`,
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

  static async GetContactsFields() {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetContactsFields`,
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

  static async GetContacts(limit, page) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetContacts?limit=${limit}&page=${page}`,
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

  static async GetContactsById(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetContactsById`,
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

  static async CreateContacts(newRecord) {
    const options = {
      method: 'post',
      url: `${getRestAPIUrl()}/Database/CreateContacts`,
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

  static async UpdateContacts(oldRecord) {
    const options = {
      method: 'put',
      url: `${getRestAPIUrl()}/Database/UpdateContacts`,
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

  static async DeleteContacts(id) {
    const options = {
      method: 'delete',
      url: `${getRestAPIUrl()}/Database/DeleteContacts`,
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
