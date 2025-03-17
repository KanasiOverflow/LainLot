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

export const getRecordById = async (currentTable, id, login, password) => {

  var response = null;

  switch (currentTable) {
    case 'About':
      response = await AboutService.GetAboutById(id, login, password);
      break;
    case 'AccessLevels':
      response = await AccessLevelsService.GetAccessLevelsById(id, login, password);
      break;
    case 'BaseBelts':
      response = await BaseBeltsService.GetBaseBeltsById(id, login, password);
      break;
    case 'BaseNecklines':
      response = await BaseNecklinesService.GetBaseNecklinesById(id, login, password);
      break;
    case 'BasePantsCuffs':
      response = await BasePantsCuffsService.GetBasePantsCuffsById(id, login, password);
      break;
    case 'BasePants':
      response = await BasePantsService.GetBasePantsById(id, login, password);
      break;
    case 'BaseSleeveCuffs':
      response = await BaseSleeveCuffsService.GetBaseSleeveCuffsById(id, login, password);
      break;
    case 'BaseSleeves':
      response = await BaseSleevesService.GetBaseSleevesById(id, login, password);
      break;
    case 'BaseSportSuits':
      response = await BaseSportSuitsService.GetBaseSportSuitsById(id, login, password);
      break;
    case 'BaseSweaters':
      response = await BaseSweatersService.GetBaseSweatersById(id, login, password);
      break;
    case 'Cart':
      response = await CartService.GetCartById(id, login, password);
      break;
    case 'Categories':
      response = await CategoriesService.GetCategoriesById(id, login, password);
      break;
    case 'CategoryHierarchy':
      response = await CategoryHierarchyService.GetCategoryHierarchyById(id, login, password);
      break;
    case 'Colors':
      response = await ColorsService.GetColorsById(id, login, password);
      break;
    case 'Contacts':
      response = await ContactsService.GetContactsById(id, login, password);
      break;
    case 'Countries':
      response = await CountriesService.GetCountriesById(id, login, password);
      break;
    case 'Currencies':
      response = await CurrenciesService.GetCurrenciesById(id, login, password);
      break;
    case 'CustomBelts':
      response = await CustomBeltsService.GetCustomBeltsById(id, login, password);
      break;
    case 'CustomizableProducts':
      response = await CustomizableProductsService.GetCustomizableProductsById(id, login, password);
      break;
    case 'CustomNecklines':
      response = await CustomNecklinesService.GetCustomNecklinesById(id, login, password);
      break;
    case 'CustomPantsCuffs':
      response = await CustomPantsCuffsService.GetCustomPantsCuffsById(id, login, password);
      break;
    case 'CustomPants':
      response = await CustomPantsService.GetCustomPantsById(id, login, password);
      break;
    case 'CustomSleeveCuffs':
      response = await CustomSleeveCuffsService.GetCustomSleeveCuffsById(id, login, password);
      break;
    case 'CustomSleeves':
      response = await CustomSleevesService.GetCustomSleevesById(id, login, password);
      break;
    case 'CustomSportSuits':
      response = await CustomSportSuitsService.GetCustomSportSuitsById(id, login, password);
      break;
    case 'CustomSweaters':
      response = await CustomSweatersService.GetCustomSweatersById(id, login, password);
      break;
    case 'FabricTypes':
      response = await FabricTypesService.GetFabricTypesById(id, login, password);
      break;
    case 'Languages':
      response = await LanguagesService.GetLanguagesById(id, login, password);
      break;
    case 'Orders':
      response = await OrdersService.GetOrdersById(id, login, password);
      break;
    case 'OrderHistory':
      response = await OrderHistoryService.GetOrderHistoryById(id, login, password);
      break;
    case 'OrderStatuses':
      response = await OrderStatusesService.GetOrderStatusesById(id, login, password);
      break;
    case 'PaymentMethods':
      response = await PaymentMethodsService.GetPaymentMethodsById(id, login, password);
      break;
    case 'Payments':
      response = await PaymentsService.GetPaymentsById(id, login, password);
      break;
    case 'PaymentStatuses':
      response = await PaymentStatusesService.GetPaymentStatusesById(id, login, password);
      break;
    case 'ProductImages':
      response = await ProductImagesService.GetProductImagesById(id, login, password);
      break;
    case 'ProductOrders':
      response = await ProductOrdersService.GetProductOrdersById(id, login, password);
      break;
    case 'Products':
      response = await ProductsService.GetProductsById(id, login, password);
      break;
    case 'ProductTranslations':
      response = await ProductTranslationsService.GetProductTranslationsById(id, login, password);
      break;
    case 'Reviews':
      response = await ReviewsService.GetReviewsById(id, login, password);
      break;
    case 'ShippingAddresses':
      response = await ShippingAddressesService.GetShippingAddressesById(id, login, password);
      break;
    case 'SizeOptions':
      response = await SizeOptionsService.GetSizeOptionsById(id, login, password);
      break;
    case 'UserOrderHistory':
      response = await UserOrderHistoryService.GetUserOrderHistoryById(id, login, password);
      break;
    case 'UserProfiles':
      response = await UserProfilesService.GetUserProfilesById(id, login, password);
      break;
    case 'UserRoles':
      response = await UserRolesService.GetUserRolesById(id, login, password);
      break;
    case 'Users':
      response = await UsersService.GetUsersById(id, login, password);
      break;
    default:
      break;
  };

  return response;
}