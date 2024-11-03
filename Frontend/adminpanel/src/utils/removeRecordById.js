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