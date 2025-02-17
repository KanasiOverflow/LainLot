import ForeignKeysService from 'api/ForeignKeysService';

export const getForeignKeyById = async (foreignFieldKey, id) => {

    var response = null;

    switch (foreignFieldKey) {
        case 'fkAccessLevels':
            response = await ForeignKeysService.GetFkAccessLevelsData(id);
            break;
        case 'fkLanguages':
            response = await ForeignKeysService.GetFkLanguagesData(id);
            break;
        case 'fkCategories':
            response = await ForeignKeysService.GetFkCategoriesData(id);
            break;
        case 'fkFabricTypes':
            response = await ForeignKeysService.GetFkFabricTypesData(id);
            break;
        case 'fkProducts':
            response = await ForeignKeysService.GetFkProductsData(id);
            break;
        case 'fkProductImages':
            response = await ForeignKeysService.GetFkProductImagesData(id);
            break;
        case 'fkProductTranslations':
            response = await ForeignKeysService.GetFkProductTranslationsData(id);
            break;
        case 'fkReviews':
            response = await ForeignKeysService.GetFkReviewsData(id);
            break;
        case 'fkOrders':
            response = await ForeignKeysService.GetFkOrdersData(id);
            break;
        case 'fkOrderHistory':
            response = await ForeignKeysService.GetFkOrderHistoryData(id);
            break;
        case 'fkPayments':
            response = await ForeignKeysService.GetFkPaymentsData(id);
            break;
        case 'fkUsers':
            response = await ForeignKeysService.GetFkUsersData(id);
            break;
        case 'fkUserRoles':
            response = await ForeignKeysService.GetFkUserRoles(id);
            break;
        case 'fkOrderStatus':
            response = await ForeignKeysService.GetFkOrderStatusData(id);
            break;
        case 'fkColors':
            response = await ForeignKeysService.GetFkColorsData(id);
            break;
        case 'fkCurrencies':
            response = await ForeignKeysService.GetFkCurrenciesData(id);
            break;
        case 'fkSizeOptions':
            response = await ForeignKeysService.GetFkSizeOptionsData(id);
            break;
        case 'fkBaseNecklines':
            response = await ForeignKeysService.GetFkBaseNecklinesData(id);
            break;
        case 'fkBaseSweaters':
            response = await ForeignKeysService.GetFkBaseSweatersData(id);
            break;
        case 'fkBaseSleeves':
            response = await ForeignKeysService.GetFkBaseSleevesData(id);
            break;
        case 'fkBaseSleeveCuffsLeft':
            response = await ForeignKeysService.GetFkBaseSleeveCuffsLeftData(id);
            break;
        case 'fkBaseSleeveCuffsRight':
            response = await ForeignKeysService.GetFkBaseSleeveCuffsRightData(id);
            break;
        case 'fkBaseBelts':
            response = await ForeignKeysService.GetFkBaseBeltsData(id);
            break;
        case 'fkBasePants':
            response = await ForeignKeysService.GetFkBasePantsData(id);
            break;
        case 'fkBasePantsCuffs':
            response = await ForeignKeysService.GetFkBasePantsCuffsData(id);
            break;
        case 'fkBasePantsCuffsLeft':
            response = await ForeignKeysService.GetFkBasePantsCuffsLeftData(id);
            break;
        case 'fkBasePantsCuffsRight':
            response = await ForeignKeysService.GetFkBasePantsCuffsRightData(id);
            break;
        case 'fkCustomNecklines':
            response = await ForeignKeysService.GetFkCustomNecklinesData(id);
            break;
        case 'fkCustomSweaters':
            response = await ForeignKeysService.GetFkCustomSweatersData(id);
            break;
        case 'fkCustomSleeves':
            response = await ForeignKeysService.GetFkCustomSleevesData(id);
            break;
        case 'fkCustomSleeveCuffsLeft':
            response = await ForeignKeysService.GetFkCustomSleeveCuffsLeftData(id);
            break;
        case 'fkCustomSleeveCuffsRight':
            response = await ForeignKeysService.GetFkCustomSleeveCuffsRightData(id);
            break;
        case 'fkCustomBelts':
            response = await ForeignKeysService.GetFkCustomBeltsData(id);
            break;
        case 'fkCustomPants':
            response = await ForeignKeysService.GetFkCustomPantsData(id);
            break;
        case 'fkCustomPantsCuffsLeft':
            response = await ForeignKeysService.GetFkCustomPantsCuffsLeftData(id);
            break;
        case 'fkCustomPantsCuffsRight':
            response = await ForeignKeysService.GetFkCustomPantsCuffsRightData(id);
            break;
        case 'fkCustomSportSuits':
            response = await ForeignKeysService.GetFkCustomSportSuitsData(id);
            break;
        case 'fkCustomizableProducts':
            response = await ForeignKeysService.GetFkCustomizableProductsData(id);
            break;
        case 'fkProductOrders':
            response = await ForeignKeysService.GetFkProductOrdersData(id);
            break;
        case 'fkCountries':
            response = await ForeignKeysService.GetFkCountriesData(id);
            break;
        case 'fkPaymentMethods':
            response = await ForeignKeysService.GetFkPaymentMethodsData(id);
            break;
        case 'fkPaymentStatuses':
            response = await ForeignKeysService.GetFkPaymentStatusesData(id);
            break;
        case 'fkShippingAddresses':
            response = await ForeignKeysService.GetFkShippingAddressesData(id);
            break;
        default:
            break;
    };

    return response;
};