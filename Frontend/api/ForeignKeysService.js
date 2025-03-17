import ApiService from '../ApiService.js';

export default class ForeignKeysService {
  static async GetFkAccessLevelsData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkAccessLevelsData', login, password, null, { id });
  }

  static async GetFkLanguagesData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkLanguagesData', login, password, null, { id });
  }

  static async GetFkCategoriesData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCategoriesData', login, password, null, { id });
  }

  static async GetFkFabricTypesData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkFabricTypesData', login, password, null, { id });
  }

  static async GetFkProductsData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkProductsData', login, password, null, { id });
  }

  static async GetFkProductImagesData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkProductImagesData', login, password, null, { id });
  }

  static async GetFkProductTranslationsData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkProductTranslationsData', login, password, null, { id });
  }

  static async GetFkReviewsData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkReviewsData', login, password, null, { id });
  }

  static async GetFkOrdersData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkOrdersData', login, password, null, { id });
  }

  static async GetFkOrderHistoryData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkOrderHistoryData', login, password, null, { id });
  }

  static async GetFkPaymentsData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkPaymentsData', login, password, null, { id });
  }

  static async GetFkUsersData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkUsersData', login, password, null, { id });
  }

  static async GetFkUserRolesData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkUserRolesData', login, password, null, { id });
  }

  static async GetFkOrderStatusData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkOrderStatusData', login, password, null, { id });
  }

  static async GetFkColorsData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkColorsData', login, password, null, { id });
  }

  static async GetFkCurrenciesData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCurrenciesData', login, password, null, { id });
  }

  static async GetFkSizeOptionsData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkSizeOptionsData', login, password, null, { id });
  }

  static async GetFkBaseNecklinesData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBaseNecklinesData', login, password, null, { id });
  }

  static async GetFkBaseSweatersData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBaseSweatersData', login, password, null, { id });
  }

  static async GetFkBaseSleevesData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBaseSleevesData', login, password, null, { id });
  }

  static async GetFkBaseSleeveCuffsLeftData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBaseSleeveCuffsLeftData', login, password, null, { id });
  }

  static async GetFkBaseSleeveCuffsRightData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBaseSleeveCuffsRightData', login, password, null, { id });
  }

  static async GetFkBaseBeltsData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBaseBeltsData', login, password, null, { id });
  }

  static async GetFkBasePantsData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBasePantsData', login, password, null, { id });
  }

  static async GetFkBasePantsCuffsData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBasePantsCuffsData', login, password, null, { id });
  }

  static async GetFkBasePantsCuffsLeftData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBasePantsCuffsLeftData', login, password, null, { id });
  }

  static async GetFkBasePantsCuffsRightData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkBasePantsCuffsRightData', login, password, null, { id });
  }

  static async GetFkCustomNecklinesData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomNecklinesData', login, password, null, { id });
  }

  static async GetFkCustomSweatersData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomSweatersData', login, password, null, { id });
  }

  static async GetFkCustomSleevesData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomSleevesData', login, password, null, { id });
  }

  static async GetFkCustomSleeveCuffsLeftData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomSleeveCuffsLeftData', login, password, null, { id });
  }

  static async GetFkCustomSleeveCuffsRightData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomSleeveCuffsRightData', login, password, null, { id });
  }

  static async GetFkCustomBeltsData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomBeltsData', login, password, null, { id });
  }

  static async GetFkCustomPantsData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomPantsData', login, password, null, { id });
  }

  static async GetFkCustomPantsCuffsLeftData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomPantsCuffsLeftData', login, password, null, { id });
  }

  static async GetFkCustomPantsCuffsRightData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomPantsCuffsRightData', login, password, null, { id });
  }

  static async GetFkCustomSportSuitsData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomSportSuitsData', login, password, null, { id });
  }

  static async GetFkCustomizableProductsData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCustomizableProductsData', login, password, null, { id });
  }

  static async GetFkProductOrdersData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkProductOrdersData', login, password, null, { id });
  }

  static async GetFkCountriesData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkCountriesData', login, password, null, { id });
  }

  static async GetFkPaymentMethodsData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkPaymentMethodsData', login, password, null, { id });
  }

  static async GetFkPaymentStatusesData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkPaymentStatusesData', login, password, null, { id });
  }

  static async GetFkShippingAddressesData(id, login, password) {
    return ApiService.sendRequest('get', 'Database', 'GetFkShippingAddressesData', login, password, null, { id });
  }
}
