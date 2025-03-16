import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { get200, get201 } from '../utils/responseCodes.js';
import { getRestAPIUrl } from '../utils/getRestAPIUrl.js';

export default class PaymentStatusesService {
  static async GetPaymentStatusesCount() {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetPaymentStatusesCount`,
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

  static async GetPaymentStatusesFields() {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetPaymentStatusesFields`,
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

  static async GetPaymentStatuses(limit, page) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetPaymentStatuses?limit=${limit}&page=${page}`,
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

  static async GetPaymentStatusesById(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetPaymentStatusesById`,
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

  static async CreatePaymentStatuses(newRecord) {
    const options = {
      method: 'post',
      url: `${getRestAPIUrl()}/Database/CreatePaymentStatuses`,
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

  static async UpdatePaymentStatuses(oldRecord) {
    const options = {
      method: 'put',
      url: `${getRestAPIUrl()}/Database/UpdatePaymentStatuses`,
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

  static async DeletePaymentStatuses(id) {
    const options = {
      method: 'delete',
      url: `${getRestAPIUrl()}/Database/DeletePaymentStatuses`,
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
