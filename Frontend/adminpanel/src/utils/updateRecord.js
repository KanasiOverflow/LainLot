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

export const updateRecord = async (currentTable, data) => {

    var response = null;

    switch (currentTable) {
        case 'About':
            response = await AboutService.UpdateAbout(data);
            break;
        case 'AccessLevels':
            response = await AccessLevelsService.UpdateAccessLevels(data);
            break;
        case 'Cart':
            response = await CartService.UpdateCart(data);
            break;
        case 'Categories':
            response = await CategoriesService.UpdateCategories(data);
            break;
        case 'CategoryHierarchy':
            response = await CategoryHierarchyService.UpdateCategoryHierarchy(data);
            break;
        case 'Colors':
            response = await ColorsService.UpdateColors(data);
            break;
        case 'Contacts':
            response = await ContactsService.UpdateContacts(data);
            break;
        case 'CustomizableProducts':
            response = await CustomizableProductsService.UpdateCustomizableProducts(data);
            break;
        case 'CustomizationOrders':
            response = await CustomizationOrdersService.UpdateCustomizationOrders(data);
            break;
        case 'FabricTypes':
            response = await FabricTypesService.UpdateFabricTypes(data);
            break;
        case 'Languages':
            response = await LanguagesService.UpdateLanguages(data);
            break;
        case 'Orders':
            response = await OrdersService.UpdateOrders(data);
            break;
        case 'OrderHistory':
            response = await OrderHistoryService.UpdateOrderHistory(data);
            break;
        case 'OrderStatuses':
            response = await OrderStatusesService.UpdateOrderStatuses(data);
            break;
        case 'Payments':
            response = await PaymentsService.UpdatePayments(data);
            break;
        case 'Products':
            response = await ProductsService.UpdateProducts(data);
            break;
        case 'ProductImages':
            response = await ProductImagesService.UpdateProductImages(data);
            break;
        case 'ProductTranslations':
            response = await ProductTranslationsService.UpdateProductTranslations(data);
            break;
        case 'Reviews':
            response = await ReviewsService.UpdateReviews(data);
            break;
        case 'Users':
            response = await UsersService.UpdateUsers(data);
            break;
        case 'UserProfiles':
            response = await UserProfilesService.UpdateUserProfiles(data);
            break;
        case 'UserRoles':
            response = await UserRolesService.UpdateUserRoles(data);
            break;
        default:
            break;
    };

    return response;
};