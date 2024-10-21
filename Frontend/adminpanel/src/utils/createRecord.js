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