import AboutService from '../API/AboutService';
import AccessLevelsService from '../API/AccessLevelsService';
import CartService from '../API/CartService';
import CategoriesService from '../API/CategoriesService';
import CategoryHierarchyService from '../API/CategoryHierarchyService';
import ColorsService from '../API/ColorsService';
import ContactsService from '../API/ContactsService';
import CustomizableProductsService from '../API/CustomizableProductsService';
import CustomizationOrdersService from '../API/CustomizationOrdersService';
import FabricTypesService from '../API/FabricTypesService';
import LanguagesService from '../API/LanguagesService';
import OrdersService from '../API/OrdersService';
import OrderHistoryService from '../API/OrderHistoryService';
import OrderStatusesService from '../API/OrderStatusesService';
import PaymentsService from '../API/PaymentsService';
import ProductsService from '../API/ProductsService';
import ProductImagesService from '../API/ProductImagesService';
import ProductTranslationsService from '../API/ProductTranslationsService';
import ReviewsService from '../API/ReviewsService';
import UsersService from '../API/UsersService';
import UserProfilesService from '../API/UserProfilesService';
import UserRolesService from '../API/UserRolesService';

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