import ApiService from './ApiService.js';

export default class ForeignKeysService {
  static async GetFkAccessLevelsData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkAccessLevelsData', login, password, null, { id });
  }

  static async GetFkLanguagesData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkLanguagesData', login, password, null, { id });
  }

  static async GetFkCategoriesData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkCategoriesData', login, password, null, { id });
  }

  static async GetFkFabricTypesData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkFabricTypesData', login, password, null, { id });
  }

  static async GetFkProductsData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkProductsData', login, password, null, { id });
  }

  static async GetFkProductImagesData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkProductImagesData', login, password, null, { id });
  }

  static async GetFkProductTranslationsData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkProductTranslationsData', login, password, null, { id });
  }

  static async GetFkReviewsData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkReviewsData', login, password, null, { id });
  }

  static async GetFkOrdersData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkOrdersData', login, password, null, { id });
  }

  static async GetFkOrderHistoryData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkOrderHistoryData', login, password, null, { id });
  }

  static async GetFkPaymentsData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkPaymentsData', login, password, null, { id });
  }

  static async GetFkUsersData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkUsersData', login, password, null, { id });
  }

  static async GetFkUserRolesData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkUserRolesData', login, password, null, { id });
  }

  static async GetFkOrderStatusData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkOrderStatusData', login, password, null, { id });
  }

  static async GetFkColorsData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkColorsData', login, password, null, { id });
  }

  static async GetFkCurrenciesData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkCurrenciesData', login, password, null, { id });
  }

  static async GetFkSizeOptionsData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkSizeOptionsData', login, password, null, { id });
  }

  static async GetFkBaseNecklinesData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkBaseNecklinesData', login, password, null, { id });
  }

  static async GetFkBaseSweatersData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkBaseSweatersData', login, password, null, { id });
  }

  static async GetFkBaseSleevesData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkBaseSleevesData', login, password, null, { id });
  }

  static async GetFkBaseSleeveCuffsLeftData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkBaseSleeveCuffsLeftData', login, password, null, { id });
  }

  static async GetFkBaseSleeveCuffsRightData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkBaseSleeveCuffsRightData', login, password, null, { id });
  }

  static async GetFkBaseBeltsData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkBaseBeltsData', login, password, null, { id });
  }

  static async GetFkBasePantsData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkBasePantsData', login, password, null, { id });
  }

  static async GetFkBasePantsCuffsData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkBasePantsCuffsData', login, password, null, { id });
  }

  static async GetFkBasePantsCuffsLeftData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkBasePantsCuffsLeftData', login, password, null, { id });
  }

  static async GetFkBasePantsCuffsRightData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkBasePantsCuffsRightData', login, password, null, { id });
  }

  static async GetFkCustomNecklinesData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkCustomNecklinesData', login, password, null, { id });
  }

  static async GetFkCustomSweatersData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkCustomSweatersData', login, password, null, { id });
  }

  static async GetFkCustomSleevesData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkCustomSleevesData', login, password, null, { id });
  }

  static async GetFkCustomSleeveCuffsLeftData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkCustomSleeveCuffsLeftData', login, password, null, { id });
  }

  static async GetFkCustomSleeveCuffsRightData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkCustomSleeveCuffsRightData', login, password, null, { id });
  }

  static async GetFkCustomBeltsData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkCustomBeltsData', login, password, null, { id });
  }

  static async GetFkCustomPantsData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkCustomPantsData', login, password, null, { id });
  }

  static async GetFkCustomPantsCuffsLeftData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkCustomPantsCuffsLeftData', login, password, null, { id });
  }

  static async GetFkCustomPantsCuffsRightData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkCustomPantsCuffsRightData', login, password, null, { id });
  }

  static async GetFkCustomSportSuitsData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkCustomSportSuitsData', login, password, null, { id });
  }

  static async GetFkCustomizableProductsData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkCustomizableProductsData', login, password, null, { id });
  }

  static async GetFkProductOrdersData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkProductOrdersData', login, password, null, { id });
  }

  static async GetFkCountriesData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkCountriesData', login, password, null, { id });
  }

  static async GetFkPaymentMethodsData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkPaymentMethodsData', login, password, null, { id });
  }

  static async GetFkPaymentStatusesData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkPaymentStatusesData', login, password, null, { id });
  }

  static async GetFkShippingAddressesData(id, login, password) {
    return ApiService.sendRequest('get', 'GetFkShippingAddressesData', login, password, null, { id });
  }
}
