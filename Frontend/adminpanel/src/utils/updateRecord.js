import AboutService from 'api/CRUD/AboutService';
import AccessLevelsService from 'api/CRUD/AccessLevelsService';
import BaseBeltsService from 'api/CRUD/BaseBeltsService';
import BaseNecklinesService from 'api/CRUD/BaseNecklinesService';
import BasePantsCuffsService from 'api/CRUD/BasePantsCuffsService';
import BasePantsService from 'api/CRUD/BasePantsService';
import BaseSleeveCuffsService from 'api/CRUD/BaseSleeveCuffsService';
import BaseSleevesService from 'api/CRUD/BaseSleevesService';
import BaseSportSuitService from 'api/CRUD/BaseSportSuitService';
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
import CustomSportSuitService from 'api/CRUD/CustomSportSuitService';
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

export const updateRecord = async (currentTable, data) => {

    var response = null;

    switch (currentTable) {
        case 'About':
            response = await AboutService.UpdateAbout(id);
            break;
        case 'AccessLevels':
            response = await AccessLevelsService.UpdateAccessLevels(id);
            break;
        case 'BaseBelts':
            response = await BaseBeltsService.UpdateBaseBelts(id);
            break;
        case 'BaseNecklines':
            response = await BaseNecklinesService.UpdateBaseNecklines(id);
            break;
        case 'BasePantsCuffs':
            response = await BasePantsCuffsService.UpdateBasePantsCuffs(id);
            break;
        case 'BasePants':
            response = await BasePantsService.UpdateBasePants(id);
            break;
        case 'BaseSleeveCuffs':
            response = await BaseSleeveCuffsService.UpdateBaseSleeveCuffs(id);
            break;
        case 'BaseSleeves':
            response = await BaseSleevesService.UpdateBaseSleeves(id);
            break;
        case 'BaseSportSuit':
            response = await BaseSportSuitService.UpdateBaseSportSuit(id);
            break;
        case 'BaseSweaters':
            response = await BaseSweatersService.UpdateBaseSweaters(id);
            break;
        case 'Cart':
            response = await CartService.UpdateCart(id);
            break;
        case 'Categories':
            response = await CategoriesService.UpdateCategories(id);
            break;
        case 'CategoryHierarchy':
            response = await CategoryHierarchyService.UpdateCategoryHierarchy(id);
            break;
        case 'Colors':
            response = await ColorsService.UpdateColors(id);
            break;
        case 'Contacts':
            response = await ContactsService.UpdateContacts(id);
            break;
        case 'Countries':
            response = await CountriesService.UpdateCountries(id);
            break;
        case 'Currencies':
            response = await CurrenciesService.UpdateCurrencies(id);
            break;
        case 'CustomBelts':
            response = await CustomBeltsService.UpdateCustomBelts(id);
            break;
        case 'CustomizableProducts':
            response = await CustomizableProductsService.UpdateCustomizableProducts(id);
            break;
        case 'CustomNecklines':
            response = await CustomNecklinesService.UpdateCustomNecklines(id);
            break;
        case 'CustomPantsCuffs':
            response = await CustomPantsCuffsService.UpdateCustomPantsCuffs(id);
            break;
        case 'CustomPants':
            response = await CustomPantsService.UpdateCustomPants(id);
            break;
        case 'CustomSleeveCuffs':
            response = await CustomSleeveCuffsService.UpdateCustomSleeveCuffs(id);
            break;
        case 'CustomSleeves':
            response = await CustomSleevesService.UpdateCustomSleeves(id);
            break;
        case 'CustomSportSuit':
            response = await CustomSportSuitService.UpdateCustomSportSuit(id);
            break;
        case 'CustomSweaters':
            response = await CustomSweatersService.UpdateCustomSweaters(id);
            break;
        case 'FabricTypes':
            response = await FabricTypesService.UpdateFabricTypes(id);
            break;
        case 'Languages':
            response = await LanguagesService.UpdateLanguages(id);
            break;
        case 'Orders':
            response = await OrdersService.UpdateOrders(id);
            break;
        case 'OrderHistory':
            response = await OrderHistoryService.UpdateOrderHistory(id);
            break;
        case 'OrderStatuses':
            response = await OrderStatusesService.UpdateOrderStatuses(id);
            break;
        case 'PaymentMethods':
            response = await PaymentMethodsService.UpdatePaymentMethods(id);
            break;
        case 'Payments':
            response = await PaymentsService.UpdatePayments(id);
            break;
        case 'PaymentStatuses':
            response = await PaymentStatusesService.UpdatePaymentStatuses(id);
            break;
        case 'ProductImages':
            response = await ProductImagesService.UpdateProductImages(id);
            break;
        case 'ProductOrders':
            response = await ProductOrdersService.UpdateProductOrders(id);
            break;
        case 'Products':
            response = await ProductsService.UpdateProducts(id);
            break;
        case 'ProductTranslations':
            response = await ProductTranslationsService.UpdateProductTranslations(id);
            break;
        case 'Reviews':
            response = await ReviewsService.UpdateReviews(id);
            break;
        case 'ShippingAddresses':
            response = await ShippingAddressesService.UpdateShippingAddresses(id);
            break;
        case 'SizeOptions':
            response = await SizeOptionsService.UpdateSizeOptions(id);
            break;
        case 'UserOrderHistory':
            response = await UserOrderHistoryService.UpdateUserOrderHistory(id);
            break;
        case 'UserProfiles':
            response = await UserProfilesService.UpdateUserProfiles(id);
            break;
        case 'UserRoles':
            response = await UserRolesService.UpdateUserRoles(id);
            break;
        case 'Users':
            response = await UsersService.UpdateUsers(id);
            break;
        default:
            break;
    };

    return response;
};