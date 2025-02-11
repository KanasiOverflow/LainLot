import AboutService from 'api/CRUD/AboutService';
import AccessLevelsService from 'api/CRUD/AccessLevelsService';
import BaseBeltsService from 'api/CRUD/BaseBeltsService';
import BaseNecklinesService from 'api/CRUD/BaseNecklinesService';
import BasePantsCuffsService from 'api/CRUD/BasePantsCuffsService';
import BasePantsService from 'api/CRUD/BasePantsService';
import BaseSleeveCuffsService from 'api/CRUD/BaseSleeveCuffsService';
import BaseSleevesService from 'api/CRUD/BaseSleevesService';
import BaseSportSuitsService from 'api/CRUD/BaseSportSuitsService';
import BaseSweatersService from 'api/CRUD/BaseSweatersService';
import CartService from 'api/CRUD/CartService';
import CategoriesService from 'api/CRUD/CategoriesService';
import CategoryHierarchyService from 'api/CRUD/CategoryHierarchyService';
import ColorsService from 'api/CRUD/ColorsService';
import ContactsService from 'api/CRUD/ContactsService';
import CountriesService from 'api/CRUD/CountriesService';
import CurrenciesService from 'api/CRUD/CurrenciesService';
import CustomBeltsService from 'api/CRUD/CustomBeltsService';
import CustomizableProductsService from 'api/CRUD/CustomizableProductsService';
import CustomNecklinesService from 'api/CRUD/CustomNecklinesService';
import CustomPantsCuffsService from 'api/CRUD/CustomPantsCuffsService';
import CustomPantsService from 'api/CRUD/CustomPantsService';
import CustomSleeveCuffsService from 'api/CRUD/CustomSleeveCuffsService';
import CustomSleevesService from 'api/CRUD/CustomSleevesService';
import CustomSportSuitsService from 'api/CRUD/CustomSportSuitsService';
import CustomSweatersService from 'api/CRUD/CustomSweatersService';
import FabricTypesService from 'api/CRUD/FabricTypesService';
import LanguagesService from 'api/CRUD/LanguagesService';
import OrdersService from 'api/CRUD/OrdersService';
import OrderHistoryService from 'api/CRUD/OrderHistoryService';
import OrderStatusesService from 'api/CRUD/OrderStatusesService';
import PaymentMethodsService from 'api/CRUD/PaymentMethodsService';
import PaymentsService from 'api/CRUD/PaymentsService';
import PaymentStatusesService from 'api/CRUD/PaymentStatusesService';
import ProductImagesService from 'api/CRUD/ProductImagesService';
import ProductOrdersService from 'api/CRUD/ProductOrdersService';
import ProductsService from 'api/CRUD/ProductsService';
import ProductTranslationsService from 'api/CRUD/ProductTranslationsService';
import ReviewsService from 'api/CRUD/ReviewsService';
import ShippingAddressesService from 'api/CRUD/ShippingAddressesService';
import SizeOptionsService from 'api/CRUD/SizeOptionsService';
import UserOrderHistoryService from 'api/CRUD/UserOrderHistoryService';
import UserProfilesService from 'api/CRUD/UserProfilesService';
import UserRolesService from 'api/CRUD/UserRolesService';
import UsersService from 'api/CRUD/UsersService';

export const removeRecordById = async (currentTable, id) => {

    var response = null;

    switch (currentTable) {
        case 'About':
            response = await AboutService.DeleteAbout(id);
            break;
        case 'AccessLevels':
            response = await AccessLevelsService.DeleteAccessLevels(id);
            break;
        case 'BaseBelts':
            response = await BaseBeltsService.DeleteBaseBelts(id);
            break;
        case 'BaseNecklines':
            response = await BaseNecklinesService.DeleteBaseNecklines(id);
            break;
        case 'BasePantsCuffs':
            response = await BasePantsCuffsService.DeleteBasePantsCuffs(id);
            break;
        case 'BasePants':
            response = await BasePantsService.DeleteBasePants(id);
            break;
        case 'BaseSleeveCuffs':
            response = await BaseSleeveCuffsService.DeleteBaseSleeveCuffs(id);
            break;
        case 'BaseSleeves':
            response = await BaseSleevesService.DeleteBaseSleeves(id);
            break;
        case 'BaseSportSuits':
            response = await BaseSportSuitsService.DeleteBaseSportSuits(id);
            break;
        case 'BaseSweaters':
            response = await BaseSweatersService.DeleteBaseSweaters(id);
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
        case 'Countries':
            response = await CountriesService.DeleteCountries(id);
            break;
        case 'Currencies':
            response = await CurrenciesService.DeleteCurrencies(id);
            break;
        case 'CustomBelts':
            response = await CustomBeltsService.DeleteCustomBelts(id);
            break;
        case 'CustomizableProducts':
            response = await CustomizableProductsService.DeleteCustomizableProducts(id);
            break;
        case 'CustomNecklines':
            response = await CustomNecklinesService.DeleteCustomNecklines(id);
            break;
        case 'CustomPantsCuffs':
            response = await CustomPantsCuffsService.DeleteCustomPantsCuffs(id);
            break;
        case 'CustomPants':
            response = await CustomPantsService.DeleteCustomPants(id);
            break;
        case 'CustomSleeveCuffs':
            response = await CustomSleeveCuffsService.DeleteCustomSleeveCuffs(id);
            break;
        case 'CustomSleeves':
            response = await CustomSleevesService.DeleteCustomSleeves(id);
            break;
        case 'CustomSportSuits':
            response = await CustomSportSuitsService.DeleteCustomSportSuit(id);
            break;
        case 'CustomSweaters':
            response = await CustomSweatersService.DeleteCustomSweaters(id);
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
        case 'PaymentMethods':
            response = await PaymentMethodsService.DeletePaymentMethods(id);
            break;
        case 'Payments':
            response = await PaymentsService.DeletePayments(id);
            break;
        case 'PaymentStatuses':
            response = await PaymentStatusesService.DeletePaymentStatuses(id);
            break;
        case 'ProductImages':
            response = await ProductImagesService.DeleteProductImages(id);
            break;
        case 'ProductOrders':
            response = await ProductOrdersService.DeleteProductOrders(id);
            break;
        case 'Products':
            response = await ProductsService.DeleteProducts(id);
            break;
        case 'ProductTranslations':
            response = await ProductTranslationsService.DeleteProductTranslations(id);
            break;
        case 'Reviews':
            response = await ReviewsService.DeleteReviews(id);
            break;
        case 'ShippingAddresses':
            response = await ShippingAddressesService.DeleteShippingAddresses(id);
            break;
        case 'SizeOptions':
            response = await SizeOptionsService.DeleteSizeOptions(id);
            break;
        case 'UserOrderHistory':
            response = await UserOrderHistoryService.DeleteUserOrderHistory(id);
            break;
        case 'UserProfiles':
            response = await UserProfilesService.DeleteUserProfiles(id);
            break;
        case 'UserRoles':
            response = await UserRolesService.DeleteUserRoles(id);
            break;
        case 'Users':
            response = await UsersService.DeleteUsers(id);
            break;
        default:
            break;
    };
    
    return response;
};