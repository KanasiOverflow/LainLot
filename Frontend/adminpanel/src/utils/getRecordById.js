import AboutService from 'api/AboutService';
import AccessLevelsService from 'api/AccessLevelsService';
import CartService from 'api/CartService';
import CategoriesService from 'api/CategoriesService';
import CategoryHierarchyService from 'api/CategoryHierarchyService';
import ColorsService from 'api/ColorsService';
import ContactsService from 'api/ContactsService';
import CustomizableProductsService from 'api/CustomizableProductsService';
import CustomizationOrdersService from 'api/CustomizationOrdersService';
import FabricTypesService from 'api/FabricTypesService';
import LanguagesService from 'api/LanguagesService';
import OrdersService from 'api/OrdersService';
import OrderHistoryService from 'api/OrderHistoryService';
import OrderStatusesService from 'api/OrderStatusesService';
import PaymentsService from 'api/PaymentsService';
import ProductsService from 'api/ProductsService';
import ProductImagesService from 'api/ProductImagesService';
import ProductTranslationsService from 'api/ProductTranslationsService';
import ReviewsService from 'api/ReviewsService';
import UsersService from 'api/UsersService';
import UserProfilesService from 'api/UserProfilesService';
import UserRolesService from 'api/UserRolesService';

export const getRecordById = async (currentTable, id) => {

    var response = null;

    switch (currentTable) {
        case 'About':
            response = await AboutService.GetAboutById(id);
            break;
        case 'AccessLevels':
            response = await AccessLevelsService.GetAccessLevelsById(id);
            break;
        case 'Cart':
            response = await CartService.GetCartById(id);
            break;
        case 'Categories':
            response = await CategoriesService.GetCategoriesById(id);
            break;
        case 'CategoryHierarchy':
            response = await CategoryHierarchyService.GetCategoryHierarchyById(id);
            break;
        case 'Colors':
            response = await ColorsService.GetColorsById(id);
            break;
        case 'Contacts':
            response = await ContactsService.GetContactsById(id);
            break;
        case 'CustomizableProducts':
            response = await CustomizableProductsService.GetCustomizableProductsById(id);
            break;
        case 'CustomizationOrders':
            response = await CustomizationOrdersService.GetCustomizationOrdersById(id);
            break;
        case 'FabricTypes':
            response = await FabricTypesService.GetFabricTypesById(id);
            break;
        case 'Languages':
            response = await LanguagesService.GetLanguagesById(id);
            break;
        case 'Orders':
            response = await OrdersService.GetOrdersById(id);
            break;
        case 'OrderHistory':
            response = await OrderHistoryService.GetOrderHistoryById(id);
            break;
        case 'OrderStatuses':
            response = await OrderStatusesService.GetOrderStatusesById(id);
            break;
        case 'Payments':
            response = await PaymentsService.GetPaymentsById(id);
            break;
        case 'Products':
            response = await ProductsService.GetProductsById(id);
            break;
        case 'ProductImages':
            response = await ProductImagesService.GetProductImagesById(id);
            break;
        case 'ProductTranslations':
            response = await ProductTranslationsService.GetProductTranslationsById(id);
            break;
        case 'Reviews':
            response = await ReviewsService.GetReviewsById(id);
            break;
        case 'Users':
            response = await UsersService.GetUsersById(id);
            break;
        case 'UserProfiles':
            response = await UserProfilesService.GetUserProfilesById(id);
            break;
        case 'UserRoles':
            response = await UserRolesService.GetUserRolesById(id);
            break;
        default:
            break;
    };

    return response;
};