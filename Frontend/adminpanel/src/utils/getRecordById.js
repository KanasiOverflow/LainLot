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

export const getRecordById = async (currentTable, id) => {

    var response = null;

    switch (currentTable) {
        case 'About':
            response = await AboutService.GetAboutById(id);
            break;
        case 'AccessLevels':
            response = await AccessLevelsService.GetAccessLevelsById(id);
            break;
        case 'BaseBelts':
            response = await BaseBeltsService.GetBaseBeltsById(id);
            break;
        case 'BaseNecklines':
            response = await BaseNecklinesService.GetBaseNecklinesById(id);
            break;
        case 'BasePantsCuffs':
            response = await BasePantsCuffsService.GetBasePantsCuffsById(id);
            break;
        case 'BasePants':
            response = await BasePantsService.GetBasePantsById(id);
            break;
        case 'BaseSleeveCuffs':
            response = await BaseSleeveCuffsService.GetBaseSleeveCuffsById(id);
            break;
        case 'BaseSleeves':
            response = await BaseSleevesService.GetBaseSleevesById(id);
            break;
        case 'BaseSportSuit':
            response = await BaseSportSuitsService.GetBaseSportSuitById(id);
            break;
        case 'BaseSweaters':
            response = await BaseSweatersService.GetBaseSweatersById(id);
            break;
        case 'Cart':
            response = await CartService.GetCartById(id);
            break;
        case 'Categories':
            response = await CategoriesService.GetCategoriesById(id);
            break;
        case 'CategoryHierarchy':
            response = await CategoryHierarchyService.GetCategoryHierarchyById(id);
            break;
        case 'Colors':
            response = await ColorsService.GetColorsById(id);
            break;
        case 'Contacts':
            response = await ContactsService.GetContactsById(id);
            break;
        case 'Countries':
            response = await CountriesService.GetCountriesById(id);
            break;
        case 'Currencies':
            response = await CurrenciesService.GetCurrenciesById(id);
            break;
        case 'CustomBelts':
            response = await CustomBeltsService.GetCustomBeltsById(id);
            break;
        case 'CustomizableProducts':
            response = await CustomizableProductsService.GetCustomizableProductsById(id);
            break;
        case 'CustomNecklines':
            response = await CustomNecklinesService.GetCustomNecklinesById(id);
            break;
        case 'CustomPantsCuffs':
            response = await CustomPantsCuffsService.GetCustomPantsCuffsById(id);
            break;
        case 'CustomPants':
            response = await CustomPantsService.GetCustomPantsById(id);
            break;
        case 'CustomSleeveCuffs':
            response = await CustomSleeveCuffsService.GetCustomSleeveCuffsById(id);
            break;
        case 'CustomSleeves':
            response = await CustomSleevesService.GetCustomSleevesById(id);
            break;
        case 'CustomSportSuit':
            response = await CustomSportSuitsService.GetCustomSportSuitById(id);
            break;
        case 'CustomSweaters':
            response = await CustomSweatersService.GetCustomSweatersById(id);
            break;
        case 'FabricTypes':
            response = await FabricTypesService.GetFabricTypesById(id);
            break;
        case 'Languages':
            response = await LanguagesService.GetLanguagesById(id);
            break;
        case 'Orders':
            response = await OrdersService.GetOrdersById(id);
            break;
        case 'OrderHistory':
            response = await OrderHistoryService.GetOrderHistoryById(id);
            break;
        case 'OrderStatuses':
            response = await OrderStatusesService.GetOrderStatusesById(id);
            break;
        case 'PaymentMethods':
            response = await PaymentMethodsService.GetPaymentMethodsById(id);
            break;
        case 'Payments':
            response = await PaymentsService.GetPaymentsById(id);
            break;
        case 'PaymentStatuses':
            response = await PaymentStatusesService.GetPaymentStatusesById(id);
            break;
        case 'ProductImages':
            response = await ProductImagesService.GetProductImagesById(id);
            break;
        case 'ProductOrders':
            response = await ProductOrdersService.GetProductOrdersById(id);
            break;
        case 'Products':
            response = await ProductsService.GetProductsById(id);
            break;
        case 'ProductTranslations':
            response = await ProductTranslationsService.GetProductTranslationsById(id);
            break;
        case 'Reviews':
            response = await ReviewsService.GetReviewsById(id);
            break;
        case 'ShippingAddresses':
            response = await ShippingAddressesService.GetShippingAddressesById(id);
            break;
        case 'SizeOptions':
            response = await SizeOptionsService.GetSizeOptionsById(id);
            break;
        case 'UserOrderHistory':
            response = await UserOrderHistoryService.GetUserOrderHistoryById(id);
            break;
        case 'UserProfiles':
            response = await UserProfilesService.GetUserProfilesById(id);
            break;
        case 'UserRoles':
            response = await UserRolesService.GetUserRolesById(id);
            break;
        case 'Users':
            response = await UsersService.GetUsersById(id);
            break;
        default:
            break;
    };

    return response;
};