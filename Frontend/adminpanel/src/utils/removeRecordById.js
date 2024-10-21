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

export const removeRecordById = async (currentTable, id) => {

    var response = null;

    switch (currentTable) {
        case 'About':
            response = await AboutService.DeleteAbout(id);
            break;
        case 'AccessLevels':
            response = await AccessLevelsService.DeleteAccessLevels(id);
            break;
        case 'Cart':
            response = await CartService.DeleteCart(id);
            break;
        case 'Categories':
            response = await CategoriesService.DeleteCategories(id);
            break;
        case 'CategoryHierarchy':
            response = await CategoryHierarchyService.DeleteCategoryHierarchy(id);
            break;
        case 'Colors':
            response = await ColorsService.DeleteColors(id);
            break;
        case 'Contacts':
            response = await ContactsService.DeleteContacts(id);
            break;
        case 'CustomizableProducts':
            response = await CustomizableProductsService.DeleteCustomizableProducts(id);
            break;
        case 'CustomizationOrders':
            response = await CustomizationOrdersService.DeleteCustomizationOrders(id);
            break;
        case 'FabricTypes':
            response = await FabricTypesService.DeleteFabricTypes(id);
            break;
        case 'Languages':
            response = await LanguagesService.DeleteLanguages(id);
            break;
        case 'Orders':
            response = await OrdersService.DeleteOrders(id);
            break;
        case 'OrderHistory':
            response = await OrderHistoryService.DeleteOrderHistory(id);
            break;
        case 'OrderStatuses':
            response = await OrderStatusesService.DeleteOrderStatuses(id);
            break;
        case 'Payments':
            response = await PaymentsService.DeletePayments(id);
            break;
        case 'Products':
            response = await ProductsService.DeleteProducts(id);
            break;
        case 'ProductImages':
            response = await ProductImagesService.DeleteProductImages(id);
            break;
        case 'ProductTranslations':
            response = await ProductTranslationsService.DeleteProductTranslations(id);
            break;
        case 'Reviews':
            response = await ReviewsService.DeleteReviews(id);
            break;
        case 'Users':
            response = await UsersService.DeleteUsers(id);
            break;
        case 'UserProfiles':
            response = await UserProfilesService.DeleteUserProfiles(id);
            break;
        case 'UserRoles':
            response = await UserRolesService.DeleteUserRoles(id);
            break;
        default:
            break;
    };

    return response;
};