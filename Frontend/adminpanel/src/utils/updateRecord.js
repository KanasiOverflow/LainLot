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

export const updateRecord = async (currentTable, data) => {

    var response = null;

    switch (currentTable) {
        case 'About':
            response = await AboutService.UpdateAbout(data);
            break;
        case 'AccessLevels':
            response = await AccessLevelsService.UpdateAccessLevels(data);
            break;
        case 'BaseBelts':
            response = await BaseBeltsService.UpdateBaseBelts(data);
            break;
        case 'BaseNecklines':
            response = await BaseNecklinesService.UpdateBaseNecklines(data);
            break;
        case 'BasePantsCuffs':
            response = await BasePantsCuffsService.UpdateBasePantsCuffs(data);
            break;
        case 'BasePants':
            response = await BasePantsService.UpdateBasePants(data);
            break;
        case 'BaseSleeveCuffs':
            response = await BaseSleeveCuffsService.UpdateBaseSleeveCuffs(data);
            break;
        case 'BaseSleeves':
            response = await BaseSleevesService.UpdateBaseSleeves(data);
            break;
        case 'BaseSportSuits':
            response = await BaseSportSuitsService.UpdateBaseSportSuits(data);
            break;
        case 'BaseSweaters':
            response = await BaseSweatersService.UpdateBaseSweaters(data);
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
        case 'Countries':
            response = await CountriesService.UpdateCountries(data);
            break;
        case 'Currencies':
            response = await CurrenciesService.UpdateCurrencies(data);
            break;
        case 'CustomBelts':
            response = await CustomBeltsService.UpdateCustomBelts(data);
            break;
        case 'CustomizableProducts':
            response = await CustomizableProductsService.UpdateCustomizableProducts(data);
            break;
        case 'CustomNecklines':
            response = await CustomNecklinesService.UpdateCustomNecklines(data);
            break;
        case 'CustomPantsCuffs':
            response = await CustomPantsCuffsService.UpdateCustomPantsCuffs(data);
            break;
        case 'CustomPants':
            response = await CustomPantsService.UpdateCustomPants(data);
            break;
        case 'CustomSleeveCuffs':
            response = await CustomSleeveCuffsService.UpdateCustomSleeveCuffs(data);
            break;
        case 'CustomSleeves':
            response = await CustomSleevesService.UpdateCustomSleeves(data);
            break;
        case 'CustomSportSuits':
            response = await CustomSportSuitsService.UpdateCustomSportSuit(data);
            break;
        case 'CustomSweaters':
            response = await CustomSweatersService.UpdateCustomSweaters(data);
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
        case 'PaymentMethods':
            response = await PaymentMethodsService.UpdatePaymentMethods(data);
            break;
        case 'Payments':
            response = await PaymentsService.UpdatePayments(data);
            break;
        case 'PaymentStatuses':
            response = await PaymentStatusesService.UpdatePaymentStatuses(data);
            break;
        case 'ProductImages':
            response = await ProductImagesService.UpdateProductImages(data);
            break;
        case 'ProductOrders':
            response = await ProductOrdersService.UpdateProductOrders(data);
            break;
        case 'Products':
            response = await ProductsService.UpdateProducts(data);
            break;
        case 'ProductTranslations':
            response = await ProductTranslationsService.UpdateProductTranslations(data);
            break;
        case 'Reviews':
            response = await ReviewsService.UpdateReviews(data);
            break;
        case 'ShippingAddresses':
            response = await ShippingAddressesService.UpdateShippingAddresses(data);
            break;
        case 'SizeOptions':
            response = await SizeOptionsService.UpdateSizeOptions(data);
            break;
        case 'UserOrderHistory':
            response = await UserOrderHistoryService.UpdateUserOrderHistory(data);
            break;
        case 'UserProfiles':
            response = await UserProfilesService.UpdateUserProfiles(data);
            break;
        case 'UserRoles':
            response = await UserRolesService.UpdateUserRoles(data);
            break;
        case 'Users':
            response = await UsersService.UpdateUsers(data);
            break;
        default:
            break;
    };

    return response;
};