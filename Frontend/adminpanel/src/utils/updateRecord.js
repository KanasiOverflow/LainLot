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