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

export const createRecord = async (currentTable, data) => {

    var response = null;

    switch (currentTable) {
        case 'About':
            response = await AboutService.CreateAbout(data);
            break;
        case 'AccessLevels':
            response = await AccessLevelsService.CreateAccessLevels(data);
            break;
        case 'BaseBelts':
            response = await BaseBeltsService.CreateBaseBelts(data);
            break;
        case 'BaseNecklines':
            response = await BaseNecklinesService.CreateBaseNecklines(data);
            break;
        case 'BasePantsCuffs':
            response = await BasePantsCuffsService.CreateBasePantsCuffs(data);
            break;
        case 'BasePants':
            response = await BasePantsService.CreateBasePants(data);
            break;
        case 'BaseSleeveCuffs':
            response = await BaseSleeveCuffsService.CreateBaseSleeveCuffs(data);
            break;
        case 'BaseSleeves':
            response = await BaseSleevesService.CreateBaseSleeves(data);
            break;
        case 'BaseSportSuits':
            response = await BaseSportSuitsService.CreateBaseSportSuits(data);
            break;
        case 'BaseSweaters':
            response = await BaseSweatersService.CreateBaseSweaters(data);
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
        case 'Countries':
            response = await CountriesService.CreateCountries(data);
            break;
        case 'Currencies':
            response = await CurrenciesService.CreateCurrencies(data);
            break;
        case 'CustomBelts':
            response = await CustomBeltsService.CreateCustomBelts(data);
            break;
        case 'CustomizableProducts':
            response = await CustomizableProductsService.CreateCustomizableProducts(data);
            break;
        case 'CustomNecklines':
            response = await CustomNecklinesService.CreateCustomNecklines(data);
            break;
        case 'CustomPantsCuffs':
            response = await CustomPantsCuffsService.CreateCustomPantsCuffs(data);
            break;
        case 'CustomPants':
            response = await CustomPantsService.CreateCustomPants(data);
            break;
        case 'CustomSleeveCuffs':
            response = await CustomSleeveCuffsService.CreateCustomSleeveCuffs(data);
            break;
        case 'CustomSleeves':
            response = await CustomSleevesService.CreateCustomSleeves(data);
            break;
        case 'CustomSportSuits':
            response = await CustomSportSuitsService.CreateCustomSportSuits(data);
            break;
        case 'CustomSweaters':
            response = await CustomSweatersService.CreateCustomSweaters(data);
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
        case 'PaymentMethods':
            response = await PaymentMethodsService.CreatePaymentMethods(data);
            break;
        case 'Payments':
            response = await PaymentsService.CreatePayments(data);
            break;
        case 'PaymentStatuses':
            response = await PaymentStatusesService.CreatePaymentStatuses(data);
            break;
        case 'ProductImages':
            response = await ProductImagesService.CreateProductImages(data);
            break;
        case 'ProductOrders':
            response = await ProductOrdersService.CreateProductOrders(data);
            break;
        case 'Products':
            response = await ProductsService.CreateProducts(data);
            break;
        case 'ProductTranslations':
            response = await ProductTranslationsService.CreateProductTranslations(data);
            break;
        case 'Reviews':
            response = await ReviewsService.CreateReviews(data);
            break;
        case 'ShippingAddresses':
            response = await ShippingAddressesService.CreateShippingAddresses(data);
            break;
        case 'SizeOptions':
            response = await SizeOptionsService.CreateSizeOptions(data);
            break;
        case 'UserOrderHistory':
            response = await UserOrderHistoryService.CreateUserOrderHistory(data);
            break;
        case 'UserProfiles':
            response = await UserProfilesService.CreateUserProfiles(data);
            break;
        case 'UserRoles':
            response = await UserRolesService.CreateUserRoles(data);
            break;
        case 'Users':
            response = await UsersService.CreateUsers(data);
            break;
        default:
            break;
    };

    return response;
};