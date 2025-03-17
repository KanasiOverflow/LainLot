import ForeignKeysService from 'api/ForeignKeysService.js';

export const getForeignKeyById = async (foreignFieldKey, id, login, password) => {
  var response = null;

  switch (foreignFieldKey) {
    case 'fkAccessLevels':
      response = await ForeignKeysService.GetFkAccessLevelsData(id, login, password);
      break;
    case 'fkLanguages':
      response = await ForeignKeysService.GetFkLanguagesData(id, login, password);
      break;
    case 'fkCategories':
      response = await ForeignKeysService.GetFkCategoriesData(id, login, password);
      break;
    case 'fkFabricTypes':
      response = await ForeignKeysService.GetFkFabricTypesData(id, login, password);
      break;
    case 'fkProducts':
      response = await ForeignKeysService.GetFkProductsData(id, login, password);
      break;
    case 'fkProductImages':
      response = await ForeignKeysService.GetFkProductImagesData(id, login, password);
      break;
    case 'fkProductTranslations':
      response = await ForeignKeysService.GetFkProductTranslationsData(id, login, password);
      break;
    case 'fkReviews':
      response = await ForeignKeysService.GetFkReviewsData(id, login, password);
      break;
    case 'fkOrders':
      response = await ForeignKeysService.GetFkOrdersData(id, login, password);
      break;
    case 'fkOrderHistory':
      response = await ForeignKeysService.GetFkOrderHistoryData(id, login, password);
      break;
    case 'fkPayments':
      response = await ForeignKeysService.GetFkPaymentsData(id, login, password);
      break;
    case 'fkUsers':
      response = await ForeignKeysService.GetFkUsersData(id, login, password);
      break;
    case 'fkUserRoles':
      response = await ForeignKeysService.GetFkUserRolesData(id, login, password);
      break;
    case 'fkOrderStatus':
      response = await ForeignKeysService.GetFkOrderStatusData(id, login, password);
      break;
    case 'fkColors':
      response = await ForeignKeysService.GetFkColorsData(id, login, password);
      break;
    case 'fkCurrencies':
      response = await ForeignKeysService.GetFkCurrenciesData(id, login, password);
      break;
    case 'fkSizeOptions':
      response = await ForeignKeysService.GetFkSizeOptionsData(id, login, password);
      break;
    case 'fkBaseNecklines':
      response = await ForeignKeysService.GetFkBaseNecklinesData(id, login, password);
      break;
    case 'fkBaseSweaters':
      response = await ForeignKeysService.GetFkBaseSweatersData(id, login, password);
      break;
    case 'fkBaseSleeves':
      response = await ForeignKeysService.GetFkBaseSleevesData(id, login, password);
      break;
    case 'fkBaseSleeveCuffsLeft':
      response = await ForeignKeysService.GetFkBaseSleeveCuffsLeftData(id, login, password);
      break;
    case 'fkBaseSleeveCuffsRight':
      response = await ForeignKeysService.GetFkBaseSleeveCuffsRightData(id, login, password);
      break;
    case 'fkBaseBelts':
      response = await ForeignKeysService.GetFkBaseBeltsData(id, login, password);
      break;
    case 'fkBasePants':
      response = await ForeignKeysService.GetFkBasePantsData(id, login, password);
      break;
    case 'fkBasePantsCuffs':
      response = await ForeignKeysService.GetFkBasePantsCuffsData(id, login, password);
      break;
    case 'fkBasePantsCuffsLeft':
      response = await ForeignKeysService.GetFkBasePantsCuffsLeftData(id, login, password);
      break;
    case 'fkBasePantsCuffsRight':
      response = await ForeignKeysService.GetFkBasePantsCuffsRightData(id, login, password);
      break;
    case 'fkCustomNecklines':
      response = await ForeignKeysService.GetFkCustomNecklinesData(id, login, password);
      break;
    case 'fkCustomSweaters':
      response = await ForeignKeysService.GetFkCustomSweatersData(id, login, password);
      break;
    case 'fkCustomSleeves':
      response = await ForeignKeysService.GetFkCustomSleevesData(id, login, password);
      break;
    case 'fkCustomSleeveCuffsLeft':
      response = await ForeignKeysService.GetFkCustomSleeveCuffsLeftData(id, login, password);
      break;
    case 'fkCustomSleeveCuffsRight':
      response = await ForeignKeysService.GetFkCustomSleeveCuffsRightData(id, login, password);
      break;
    case 'fkCustomBelts':
      response = await ForeignKeysService.GetFkCustomBeltsData(id, login, password);
      break;
    case 'fkCustomPants':
      response = await ForeignKeysService.GetFkCustomPantsData(id, login, password);
      break;
    case 'fkCustomPantsCuffsLeft':
      response = await ForeignKeysService.GetFkCustomPantsCuffsLeftData(id, login, password);
      break;
    case 'fkCustomPantsCuffsRight':
      response = await ForeignKeysService.GetFkCustomPantsCuffsRightData(id, login, password);
      break;
    case 'fkCustomSportSuits':
      response = await ForeignKeysService.GetFkCustomSportSuitsData(id, login, password);
      break;
    case 'fkCustomizableProducts':
      response = await ForeignKeysService.GetFkCustomizableProductsData(id, login, password);
      break;
    case 'fkProductOrders':
      response = await ForeignKeysService.GetFkProductOrdersData(id, login, password);
      break;
    case 'fkCountries':
      response = await ForeignKeysService.GetFkCountriesData(id, login, password);
      break;
    case 'fkPaymentMethods':
      response = await ForeignKeysService.GetFkPaymentMethodsData(id, login, password);
      break;
    case 'fkPaymentStatuses':
      response = await ForeignKeysService.GetFkPaymentStatusesData(id, login, password);
      break;
    case 'fkShippingAddresses':
      response = await ForeignKeysService.GetFkShippingAddressesData(id, login, password);
      break;
    default:
      break;
  };

  return response;
}