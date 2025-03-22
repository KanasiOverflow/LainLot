import ApiService from './ApiService.js';

export default class ForeignKeysService {
  static async GetFkAccessLevelsData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkAccessLevelsData', token, null, { id });
  }

  static async GetFkLanguagesData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkLanguagesData', token, null, { id });
  }

  static async GetFkCategoriesData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCategoriesData', token, null, { id });
  }

  static async GetFkFabricTypesData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkFabricTypesData', token, null, { id });
  }

  static async GetFkProductsData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkProductsData', token, null, { id });
  }

  static async GetFkProductImagesData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkProductImagesData', token, null, { id });
  }

  static async GetFkProductTranslationsData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkProductTranslationsData', token, null, { id });
  }

  static async GetFkReviewsData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkReviewsData', token, null, { id });
  }

  static async GetFkOrdersData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkOrdersData', token, null, { id });
  }

  static async GetFkOrderHistoryData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkOrderHistoryData', token, null, { id });
  }

  static async GetFkPaymentsData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkPaymentsData', token, null, { id });
  }

  static async GetFkUsersData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkUsersData', token, null, { id });
  }

  static async GetFkUserRolesData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkUserRolesData', token, null, { id });
  }

  static async GetFkOrderStatusData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkOrderStatusData', token, null, { id });
  }

  static async GetFkColorsData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkColorsData', token, null, { id });
  }

  static async GetFkCurrenciesData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCurrenciesData', token, null, { id });
  }

  static async GetFkSizeOptionsData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkSizeOptionsData', token, null, { id });
  }

  static async GetFkBaseNecklinesData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBaseNecklinesData', token, null, { id });
  }

  static async GetFkBaseSweatersData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBaseSweatersData', token, null, { id });
  }

  static async GetFkBaseSleevesData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBaseSleevesData', token, null, { id });
  }

  static async GetFkBaseSleeveCuffsLeftData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBaseSleeveCuffsLeftData', token, null, { id });
  }

  static async GetFkBaseSleeveCuffsRightData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBaseSleeveCuffsRightData', token, null, { id });
  }

  static async GetFkBaseBeltsData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBaseBeltsData', token, null, { id });
  }

  static async GetFkBasePantsData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBasePantsData', token, null, { id });
  }

  static async GetFkBasePantsCuffsData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBasePantsCuffsData', token, null, { id });
  }

  static async GetFkBasePantsCuffsLeftData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBasePantsCuffsLeftData', token, null, { id });
  }

  static async GetFkBasePantsCuffsRightData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBasePantsCuffsRightData', token, null, { id });
  }

  static async GetFkCustomNecklinesData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomNecklinesData', token, null, { id });
  }

  static async GetFkCustomSweatersData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomSweatersData', token, null, { id });
  }

  static async GetFkCustomSleevesData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomSleevesData', token, null, { id });
  }

  static async GetFkCustomSleeveCuffsLeftData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomSleeveCuffsLeftData', token, null, { id });
  }

  static async GetFkCustomSleeveCuffsRightData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomSleeveCuffsRightData', token, null, { id });
  }

  static async GetFkCustomBeltsData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomBeltsData', token, null, { id });
  }

  static async GetFkCustomPantsData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomPantsData', token, null, { id });
  }

  static async GetFkCustomPantsCuffsLeftData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomPantsCuffsLeftData', token, null, { id });
  }

  static async GetFkCustomPantsCuffsRightData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomPantsCuffsRightData', token, null, { id });
  }

  static async GetFkCustomSportSuitsData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomSportSuitsData', token, null, { id });
  }

  static async GetFkCustomizableProductsData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomizableProductsData', token, null, { id });
  }

  static async GetFkProductOrdersData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkProductOrdersData', token, null, { id });
  }

  static async GetFkCountriesData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCountriesData', token, null, { id });
  }

  static async GetFkPaymentMethodsData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkPaymentMethodsData', token, null, { id });
  }

  static async GetFkPaymentStatusesData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkPaymentStatusesData', token, null, { id });
  }

  static async GetFkShippingAddressesData(id, token) {
    return ApiService.sendRequest('get', 'Database', 'GetFkShippingAddressesData', token, null, { id });
  }
}
