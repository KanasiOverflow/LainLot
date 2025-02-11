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
        case 'fkOrderStatusData':
            response = await ForeignKeysService.GetFkOrderStatusData(id);
            break;
        case 'fkColorsData':
            response = await ForeignKeysService.GetFkColorsData(id);
            break;
        case 'fkCurrenciesData':
            response = await ForeignKeysService.GetFkCurrenciesData(id);
            break;
        case 'fkSizeOptionsData':
            response = await ForeignKeysService.GetFkSizeOptionsData(id);
            break;
        case 'fkBaseNecklinesData':
            response = await ForeignKeysService.GetFkBaseNecklinesData(id);
            break;
        case 'fkBaseSweatersData':
            response = await ForeignKeysService.GetFkBaseSweatersData(id);
            break;
        case 'fkBaseSleevesData':
            response = await ForeignKeysService.GetFkBaseSleevesData(id);
            break;
        case 'fkBaseSleeveCuffsLeftData':
            response = await ForeignKeysService.GetFkBaseSleeveCuffsLeftData(id);
            break;
        case 'fkBaseSleeveCuffsRightData':
            response = await ForeignKeysService.GetFkBaseSleeveCuffsRightData(id);
            break;
        case 'fkBaseBeltsData':
            response = await ForeignKeysService.GetFkBaseBeltsData(id);
            break;
        case 'fkBasePantsData':
            response = await ForeignKeysService.GetFkBasePantsData(id);
            break;
        case 'fkBasePantsCuffsLeftData':
            response = await ForeignKeysService.GetFkBasePantsCuffsLeftData(id);
            break;
        case 'fkBasePantsCuffsRightData':
            response = await ForeignKeysService.GetFkBasePantsCuffsRightData(id);
            break;
        case 'fkCustomNecklinesData':
            response = await ForeignKeysService.GetFkCustomNecklinesData(id);
            break;
        case 'fkCustomSweatersData':
            response = await ForeignKeysService.GetFkCustomSweatersData(id);
            break;
        case 'fkCustomSleevesData':
            response = await ForeignKeysService.GetFkCustomSleevesData(id);
            break;
        case 'fkCustomSleeveCuffsLeftData':
            response = await ForeignKeysService.GetFkCustomSleeveCuffsLeftData(id);
            break;
        case 'fkCustomSleeveCuffsRightData':
            response = await ForeignKeysService.GetFkCustomSleeveCuffsRightData(id);
            break;
        case 'fkCustomBeltsData':
            response = await ForeignKeysService.GetFkCustomBeltsData(id);
            break;
        case 'fkCustomPantsData':
            response = await ForeignKeysService.GetFkCustomPantsData(id);
            break;
        case 'fkCustomPantsCuffsLeftData':
            response = await ForeignKeysService.GetFkCustomPantsCuffsLeftData(id);
            break;
        case 'fkCustomPantsCuffsRightData':
            response = await ForeignKeysService.GetFkCustomPantsCuffsRightData(id);
            break;
        case 'fkCustomSportSuitsData':
            response = await ForeignKeysService.GetFkCustomSportSuitsData(id);
            break;
        case 'fkCustomizableProductsData':
            response = await ForeignKeysService.GetFkCustomizableProductsData(id);
            break;
        case 'fkProductOrdersData':
            response = await ForeignKeysService.GetFkProductOrdersData(id);
            break;
        case 'fkCountriesData':
            response = await ForeignKeysService.GetFkCountriesData(id);
            break;
        case 'fkPaymentMethodsData':
            response = await ForeignKeysService.GetFkPaymentMethodsData(id);
            break;
        case 'fkPaymentStatusesData':
            response = await ForeignKeysService.GetFkPaymentStatusesData(id);
            break;
        case 'fkShippingAddressesData':
            response = await ForeignKeysService.GetFkShippingAddressesData(id);
            break;
        default:
            break;
    };

    return response;
};