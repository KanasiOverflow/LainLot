import AboutService from 'api/CRUD/AboutService';
import AccessLevelsService from 'api/CRUD/AccessLevelsService';
import CartService from 'api/CRUD/CartService';
import CategoriesService from 'api/CRUD/CategoriesService';
import CategoryHierarchyService from 'api/CRUD/CategoryHierarchyService';
import ColorsService from 'api/CRUD/ColorsService';
import ContactsService from 'api/CRUD/ContactsService';
import CustomizableProductsService from 'api/CRUD/CustomizableProductsService';
import CustomizationOrdersService from 'api/CRUD/CustomizationOrdersService';
import FabricTypesService from 'api/CRUD/FabricTypesService';
import LanguagesService from 'api/CRUD/LanguagesService';
import OrdersService from 'api/CRUD/OrdersService';
import OrderHistoryService from 'api/CRUD/OrderHistoryService';
import OrderStatusesService from 'api/CRUD/OrderStatusesService';
import PaymentsService from 'api/CRUD/PaymentsService';
import ProductsService from 'api/CRUD/ProductsService';
import ProductImagesService from 'api/CRUD/ProductImagesService';
import ProductTranslationsService from 'api/CRUD/ProductTranslationsService';
import ReviewsService from 'api/CRUD/ReviewsService';
import UsersService from 'api/CRUD/UsersService';
import UserProfilesService from 'api/CRUD/UserProfilesService';
import UserRolesService from 'api/CRUD/UserRolesService';

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