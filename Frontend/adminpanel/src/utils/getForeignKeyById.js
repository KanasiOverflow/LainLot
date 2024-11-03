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
        default:
            break;
    };

    return response;
};