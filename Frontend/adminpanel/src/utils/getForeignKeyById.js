import * as ForeignKeysService from 'api';

export const getForeignKeyById = async (foreignFieldKey, id, login, password) => {
  const endpointMapping = {
    fkAccessLevels: 'GetFkAccessLevelsData',
    fkLanguages: 'GetFkLanguagesData',
    fkCategories: 'GetFkCategoriesData',
    fkFabricTypes: 'GetFkFabricTypesData',
    fkProducts: 'GetFkProductsData',
    fkProductImages: 'GetFkProductImagesData',
    fkProductTranslations: 'GetFkProductTranslationsData',
    fkReviews: 'GetFkReviewsData',
    fkOrders: 'GetFkOrdersData',
    fkOrderHistory: 'GetFkOrderHistoryData',
    fkPayments: 'GetFkPaymentsData',
    fkUsers: 'GetFkUsersData',
    fkUserRoles: 'GetFkUserRolesData',
    fkOrderStatus: 'GetFkOrderStatusData',
    fkColors: 'GetFkColorsData',
    fkCurrencies: 'GetFkCurrenciesData',
    fkSizeOptions: 'GetFkSizeOptionsData',
    fkBaseNecklines: 'GetFkBaseNecklinesData',
    fkBaseSweaters: 'GetFkBaseSweatersData',
    fkBaseSleeves: 'GetFkBaseSleevesData',
    fkBaseSleeveCuffsLeft: 'GetFkBaseSleeveCuffsLeftData',
    fkBaseSleeveCuffsRight: 'GetFkBaseSleeveCuffsRightData',
    fkBaseBelts: 'GetFkBaseBeltsData',
    fkBasePants: 'GetFkBasePantsData',
    fkBasePantsCuffs: 'GetFkBasePantsCuffsData',
    fkBasePantsCuffsLeft: 'GetFkBasePantsCuffsLeftData',
    fkBasePantsCuffsRight: 'GetFkBasePantsCuffsRightData',
    fkCustomNecklines: 'GetFkCustomNecklinesData',
    fkCustomSweaters: 'GetFkCustomSweatersData',
    fkCustomSleeves: 'GetFkCustomSleevesData',
    fkCustomSleeveCuffsLeft: 'GetFkCustomSleeveCuffsLeftData',
    fkCustomSleeveCuffsRight: 'GetFkCustomSleeveCuffsRightData',
    fkCustomBelts: 'GetFkCustomBeltsData',
    fkCustomPants: 'GetFkCustomPantsData',
    fkCustomPantsCuffsLeft: 'GetFkCustomPantsCuffsLeftData',
    fkCustomPantsCuffsRight: 'GetFkCustomPantsCuffsRightData',
    fkCustomSportSuits: 'GetFkCustomSportSuitsData',
    fkCustomizableProducts: 'GetFkCustomizableProductsData',
    fkProductOrders: 'GetFkProductOrdersData',
    fkCountries: 'GetFkCountriesData',
    fkPaymentMethods: 'GetFkPaymentMethodsData',
    fkPaymentStatuses: 'GetFkPaymentStatusesData',
    fkShippingAddresses: 'GetFkShippingAddressesData'
  };

  const methodName = endpointMapping[foreignFieldKey];

  if (!methodName || !ForeignKeysService[methodName]) {
    console.error(`Unknown foreign key or method not found: ${foreignFieldKey}`);
    return null;
  }

  try {
    return await ForeignKeysService[methodName](id, login, password);
  } catch (error) {
    console.error(`Error fetching foreign key data for ${foreignFieldKey}:`, error);
    return null;
  }
};
