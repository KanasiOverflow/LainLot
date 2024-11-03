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

export const createRecord = async (currentTable, data) => {

    var response = null;

    switch (currentTable) {
        case 'About':
            response = await AboutService.CreateAbout(data);
            break;
        case 'AccessLevels':
            response = await AccessLevelsService.CreateAccessLevels(data);
            break;
        case 'Cart':
            response = await CartService.CreateCart(data);
            break;
        case 'Categories':
            response = await CategoriesService.CreateCategories(data);
            break;
        case 'CategoryHierarchy':
            response = await CategoryHierarchyService.CreateCategoryHierarchy(data);
            break;
        case 'Colors':
            response = await ColorsService.CreateColors(data);
            break;
        case 'Contacts':
            response = await ContactsService.CreateContacts(data);
            break;
        case 'CustomizableProducts':
            response = await CustomizableProductsService.CreateCustomizableProducts(data);
            break;
        case 'CustomizationOrders':
            response = await CustomizationOrdersService.CreateCustomizationOrders(data);
            break;
        case 'FabricTypes':
            response = await FabricTypesService.CreateFabricTypes(data);
            break;
        case 'Languages':
            response = await LanguagesService.CreateLanguages(data);
            break;
        case 'Orders':
            response = await OrdersService.CreateOrders(data);
            break;
        case 'OrderHistory':
            response = await OrderHistoryService.CreateOrderHistory(data);
            break;
        case 'OrderStatuses':
            response = await OrderStatusesService.CreateOrderStatuses(data);
            break;
        case 'Payments':
            response = await PaymentsService.CreatePayments(data);
            break;
        case 'Products':
            response = await ProductsService.CreateProducts(data);
            break;
        case 'ProductImages':
            response = await ProductImagesService.CreateProductImages(data);
            break;
        case 'ProductTranslations':
            response = await ProductTranslationsService.CreateProductTranslations(data);
            break;
        case 'Reviews':
            response = await ReviewsService.CreateReviews(data);
            break;
        case 'Users':
            response = await UsersService.CreateUsers(data);
            break;
        case 'UserProfiles':
            response = await UserProfilesService.CreateUserProfiles(data);
            break;
        case 'UserRoles':
            response = await UserRolesService.CreateUserRoles(data);
            break;
        default:
            break;
    };

    return response;
};