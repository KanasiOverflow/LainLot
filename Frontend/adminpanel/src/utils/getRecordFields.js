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
      response = await BaseSportSuitsService.GetBaseSportSuitFields();
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
      response = await CustomizableProductsService.GetCustomizableProductsFields();
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
      response = await CustomSportSuitsService.GetCustomSportSuitFields();
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
      response = await ProductTranslationsService.GetProductTranslationsFields();
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
  };

  return response;
};