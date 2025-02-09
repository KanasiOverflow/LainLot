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