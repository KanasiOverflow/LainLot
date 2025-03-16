import AboutService from 'api/CRUD/AboutService.js';
import AccessLevelsService from 'api/CRUD/AccessLevelsService.js';
import BaseBeltsService from 'api/CRUD/BaseBeltsService.js';
import BaseNecklinesService from 'api/CRUD/BaseNecklinesService.js';
import BasePantsCuffsService from 'api/CRUD/BasePantsCuffsService.js';
import BasePantsService from 'api/CRUD/BasePantsService.js';
import BaseSleeveCuffsService from 'api/CRUD/BaseSleeveCuffsService.js';
import BaseSleevesService from 'api/CRUD/BaseSleevesService.js';
import BaseSportSuitsService from 'api/CRUD/BaseSportSuitsService.js';
import BaseSweatersService from 'api/CRUD/BaseSweatersService.js';
import CartService from 'api/CRUD/CartService.js';
import CategoriesService from 'api/CRUD/CategoriesService.js';
import CategoryHierarchyService from 'api/CRUD/CategoryHierarchyService.js';
import ColorsService from 'api/CRUD/ColorsService.js';
import ContactsService from 'api/CRUD/ContactsService.js';
import CountriesService from 'api/CRUD/CountriesService.js';
import CurrenciesService from 'api/CRUD/CurrenciesService.js';
import CustomBeltsService from 'api/CRUD/CustomBeltsService.js';
import CustomizableProductsService from 'api/CRUD/CustomizableProductsService.js';
import CustomNecklinesService from 'api/CRUD/CustomNecklinesService.js';
import CustomPantsCuffsService from 'api/CRUD/CustomPantsCuffsService.js';
import CustomPantsService from 'api/CRUD/CustomPantsService.js';
import CustomSleeveCuffsService from 'api/CRUD/CustomSleeveCuffsService.js';
import CustomSleevesService from 'api/CRUD/CustomSleevesService.js';
import CustomSportSuitsService from 'api/CRUD/CustomSportSuitsService.js';
import CustomSweatersService from 'api/CRUD/CustomSweatersService.js';
import FabricTypesService from 'api/CRUD/FabricTypesService.js';
import LanguagesService from 'api/CRUD/LanguagesService.js';
import OrdersService from 'api/CRUD/OrdersService.js';
import OrderHistoryService from 'api/CRUD/OrderHistoryService.js';
import OrderStatusesService from 'api/CRUD/OrderStatusesService.js';
import PaymentMethodsService from 'api/CRUD/PaymentMethodsService.js';
import PaymentsService from 'api/CRUD/PaymentsService.js';
import PaymentStatusesService from 'api/CRUD/PaymentStatusesService.js';
import ProductImagesService from 'api/CRUD/ProductImagesService.js';
import ProductOrdersService from 'api/CRUD/ProductOrdersService.js';
import ProductsService from 'api/CRUD/ProductsService.js';
import ProductTranslationsService from 'api/CRUD/ProductTranslationsService.js';
import ReviewsService from 'api/CRUD/ReviewsService.js';
import ShippingAddressesService from 'api/CRUD/ShippingAddressesService.js';
import SizeOptionsService from 'api/CRUD/SizeOptionsService.js';
import UserOrderHistoryService from 'api/CRUD/UserOrderHistoryService.js';
import UserProfilesService from 'api/CRUD/UserProfilesService.js';
import UserRolesService from 'api/CRUD/UserRolesService.js';
import UsersService from 'api/CRUD/UsersService.js';

export const getRecordFields = async (currentTable) => {
  var response = null;

  switch (currentTable) {
    case 'About':
      response = await AboutService.GetAboutFields();
      break;
    case 'AccessLevels':
      response = await AccessLevelsService.GetAccessLevelsFields();
      break;
    case 'BaseBelts':
      response = await BaseBeltsService.GetBaseBeltsFields();
      break;
    case 'BaseNecklines':
      response = await BaseNecklinesService.GetBaseNecklinesFields();
      break;
    case 'BasePantsCuffs':
      response = await BasePantsCuffsService.GetBasePantsCuffsFields();
      break;
    case 'BasePants':
      response = await BasePantsService.GetBasePantsFields();
      break;
    case 'BaseSleeveCuffs':
      response = await BaseSleeveCuffsService.GetBaseSleeveCuffsFields();
      break;
    case 'BaseSleeves':
      response = await BaseSleevesService.GetBaseSleevesFields();
      break;
    case 'BaseSportSuits':
      response = await BaseSportSuitsService.GetBaseSportSuitsFields();
      break;
    case 'BaseSweaters':
      response = await BaseSweatersService.GetBaseSweatersFields();
      break;
    case 'Cart':
      response = await CartService.GetCartFields();
      break;
    case 'Categories':
      response = await CategoriesService.GetCategoriesFields();
      break;
    case 'CategoryHierarchy':
      response = await CategoryHierarchyService.GetCategoryHierarchyFields();
      break;
    case 'Colors':
      response = await ColorsService.GetColorsFields();
      break;
    case 'Contacts':
      response = await ContactsService.GetContactsFields();
      break;
    case 'Countries':
      response = await CountriesService.GetCountriesFields();
      break;
    case 'Currencies':
      response = await CurrenciesService.GetCurrenciesFields();
      break;
    case 'CustomBelts':
      response = await CustomBeltsService.GetCustomBeltsFields();
      break;
    case 'CustomizableProducts':
      response =
        await CustomizableProductsService.GetCustomizableProductsFields();
      break;
    case 'CustomNecklines':
      response = await CustomNecklinesService.GetCustomNecklinesFields();
      break;
    case 'CustomPantsCuffs':
      response = await CustomPantsCuffsService.GetCustomPantsCuffsFields();
      break;
    case 'CustomPants':
      response = await CustomPantsService.GetCustomPantsFields();
      break;
    case 'CustomSleeveCuffs':
      response = await CustomSleeveCuffsService.GetCustomSleeveCuffsFields();
      break;
    case 'CustomSleeves':
      response = await CustomSleevesService.GetCustomSleevesFields();
      break;
    case 'CustomSportSuits':
      response = await CustomSportSuitsService.GetCustomSportSuitsFields();
      break;
    case 'CustomSweaters':
      response = await CustomSweatersService.GetCustomSweatersFields();
      break;
    case 'FabricTypes':
      response = await FabricTypesService.GetFabricTypesFields();
      break;
    case 'Languages':
      response = await LanguagesService.GetLanguagesFields();
      break;
    case 'Orders':
      response = await OrdersService.GetOrdersFields();
      break;
    case 'OrderHistory':
      response = await OrderHistoryService.GetOrderHistoryFields();
      break;
    case 'OrderStatuses':
      response = await OrderStatusesService.GetOrderStatusesFields();
      break;
    case 'PaymentMethods':
      response = await PaymentMethodsService.GetPaymentMethodsFields();
      break;
    case 'Payments':
      response = await PaymentsService.GetPaymentsFields();
      break;
    case 'PaymentStatuses':
      response = await PaymentStatusesService.GetPaymentStatusesFields();
      break;
    case 'ProductImages':
      response = await ProductImagesService.GetProductImagesFields();
      break;
    case 'ProductOrders':
      response = await ProductOrdersService.GetProductOrdersFields();
      break;
    case 'Products':
      response = await ProductsService.GetProductsFields();
      break;
    case 'ProductTranslations':
      response =
        await ProductTranslationsService.GetProductTranslationsFields();
      break;
    case 'Reviews':
      response = await ReviewsService.GetReviewsFields();
      break;
    case 'ShippingAddresses':
      response = await ShippingAddressesService.GetShippingAddressesFields();
      break;
    case 'SizeOptions':
      response = await SizeOptionsService.GetSizeOptionsFields();
      break;
    case 'UserOrderHistory':
      response = await UserOrderHistoryService.GetUserOrderHistoryFields();
      break;
    case 'UserProfiles':
      response = await UserProfilesService.GetUserProfilesFields();
      break;
    case 'UserRoles':
      response = await UserRolesService.GetUserRolesFields();
      break;
    case 'Users':
      response = await UsersService.GetUsersFields();
      break;
    default:
      break;
  }

  return response;
};
