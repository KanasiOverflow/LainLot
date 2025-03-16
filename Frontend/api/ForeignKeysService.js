import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { get200 } from './utils/responseCodes.js';
import { getRestAPIUrl } from './utils/getRestAPIUrl.js';

export default class ForeignKeysService {
  static async GetFkAccessLevelsData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkAccessLevelsData`,
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

  static async GetFkLanguagesData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkLanguagesData`,
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

  static async GetFkCategoriesData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkCategoriesData`,
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

  static async GetFkFabricTypesData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkFabricTypesData`,
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

  static async GetFkProductsData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkProductsData`,
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

  static async GetFkProductImagesData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkProductImagesData`,
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

  static async GetFkProductTranslationsData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkProductTranslationsData`,
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

  static async GetFkReviewsData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkReviewsData`,
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

  static async GetFkOrdersData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkOrdersData`,
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

  static async GetFkOrderHistoryData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkOrdersData`,
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

  static async GetFkPaymentsData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkPaymentsData`,
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

  static async GetFkUsersData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkUsersData`,
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

  static async GetFkUserRolesData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkUserRolesData`,
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

  static async GetFkOrderStatusData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkOrderStatusData`,
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

  static async GetFkColorsData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkColorsData`,
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

  static async GetFkCurrenciesData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkCurrenciesData`,
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

  static async GetFkSizeOptionsData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkSizeOptionsData`,
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

  static async GetFkBaseNecklinesData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkBaseNecklinesData`,
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

  static async GetFkBaseSweatersData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkBaseSweatersData`,
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

  static async GetFkBaseSleevesData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkBaseSleevesData`,
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

  static async GetFkBaseSleeveCuffsLeftData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkBaseSleeveCuffsLeftData`,
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

  static async GetFkBaseSleeveCuffsRightData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkBaseSleeveCuffsRightData`,
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

  static async GetFkBaseBeltsData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkBaseBeltsData`,
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

  static async GetFkBasePantsData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkBasePantsData`,
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

  static async GetFkBasePantsCuffsData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkBasePantsCuffsData`,
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

  static async GetFkBasePantsCuffsLeftData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkBasePantsCuffsLeftData`,
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

  static async GetFkBasePantsCuffsRightData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkBasePantsCuffsRightData`,
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

  static async GetFkCustomNecklinesData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkCustomNecklinesData`,
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

  static async GetFkCustomSweatersData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkCustomSweatersData`,
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

  static async GetFkCustomSleevesData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkCustomSleevesData`,
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

  static async GetFkCustomSleeveCuffsLeftData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkCustomSleeveCuffsLeftData`,
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

  static async GetFkCustomSleeveCuffsRightData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkCustomSleeveCuffsRightData`,
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

  static async GetFkCustomBeltsData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkCustomBeltsData`,
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

  static async GetFkCustomPantsData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkCustomPantsData`,
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

  static async GetFkCustomPantsCuffsLeftData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkCustomPantsCuffsLeftData`,
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

  static async GetFkCustomPantsCuffsRightData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkCustomPantsCuffsRightData`,
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

  static async GetFkCustomSportSuitsData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkCustomSportSuitsData`,
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

  static async GetFkCustomizableProductsData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkCustomizableProductsData`,
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

  static async GetFkProductOrdersData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkProductOrdersData`,
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

  static async GetFkCountriesData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkCountriesData`,
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

  static async GetFkPaymentMethodsData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkPaymentMethodsData`,
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

  static async GetFkPaymentStatusesData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkPaymentStatusesData`,
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

  static async GetFkShippingAddressesData(id) {
    const options = {
      method: 'get',
      url: `${getRestAPIUrl()}/Database/GetFkShippingAddressesData`,
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
