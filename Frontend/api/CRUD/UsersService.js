import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { get200, get201 } from '../utils/responseCodes';
import { getRestAPIUrl } from '../utils/getRestAPIUrl';

export default class UsersService {
  static async GetUsersCount() {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetUsersCount`,
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

  static async GetUsersFields() {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetUsersFields`,
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

  static async GetUsers(limit, page) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetUsers?limit=${limit}&page=${page}`,
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

  static async GetUsersById(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetUsersById`,
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

  static async CreateUsers(newRecord) {
    const options = {
      method: 'post',
      url: `${getRestAPIUrl()}/Database/CreateUsers`,
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

  static async UpdateUsers(oldRecord) {
    const options = {
      method: 'put',
      url: `${getRestAPIUrl()}/Database/UpdateUsers`,
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

  static async DeleteUsers(id) {
    const options = {
      method: 'delete',
      url: `${getRestAPIUrl()}/Database/DeleteUsers`,
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
