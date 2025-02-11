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

export const getTableTotalCount = async (currentTable) => {

  var response = null;

  switch (currentTable) {
    case 'About':
      response = await AboutService.GetAboutCount();
      break;
    case 'AccessLevels':
      response = await AccessLevelsService.GetAccessLevelsCount();
      break;
    case 'BaseBelts':
      response = await BaseBeltsService.GetBaseBeltsCount();
      break;
    case 'BaseNecklines':
      response = await BaseNecklinesService.GetBaseNecklinesCount();
      break;
    case 'BasePantsCuffs':
      response = await BasePantsCuffsService.GetBasePantsCuffsCount();
      break;
    case 'BasePants':
      response = await BasePantsService.GetBasePantsCount();
      break;
    case 'BaseSleeveCuffs':
      response = await BaseSleeveCuffsService.GetBaseSleeveCuffsCount();
      break;
    case 'BaseSleeves':
      response = await BaseSleevesService.GetBaseSleevesCount();
      break;
    case 'BaseSportSuit':
      response = await BaseSportSuitService.GetBaseSportSuitCount();
      break;
    case 'BaseSweaters':
      response = await BaseSweatersService.GetBaseSweatersCount();
      break;
    case 'Cart':
      response = await CartService.GetCartCount();
      break;
    case 'Categories':
      response = await CategoriesService.GetCategoriesCount();
      break;
    case 'CategoryHierarchy':
      response = await CategoryHierarchyService.GetCategoryHierarchyCount();
      break;
    case 'Colors':
      response = await ColorsService.GetColorsCount();
      break;
    case 'Contacts':
      response = await ContactsService.GetContactsCount();
      break;
    case 'Countries':
      response = await CountriesService.GetCountriesCount();
      break;
    case 'Currencies':
      response = await CurrenciesService.GetCurrenciesCount();
      break;
    case 'CustomBelts':
      response = await CustomBeltsService.GetCustomBeltsCount();
      break;
    case 'CustomizableProducts':
      response = await CustomizableProductsService.GetCustomizableProductsCount();
      break;
    case 'CustomNecklines':
      response = await CustomNecklinesService.GetCustomNecklinesCount();
      break;
    case 'CustomPantsCuffs':
      response = await CustomPantsCuffsService.GetCustomPantsCuffsCount();
      break;
    case 'CustomPants':
      response = await CustomPantsService.GetCustomPantsCount();
      break;
    case 'CustomSleeveCuffs':
      response = await CustomSleeveCuffsService.GetCustomSleeveCuffsCount();
      break;
    case 'CustomSleeves':
      response = await CustomSleevesService.GetCustomSleevesCount();
      break;
    case 'CustomSportSuit':
      response = await CustomSportSuitsService.GetCustomSportSuitCount();
      break;
    case 'CustomSweaters':
      response = await CustomSweatersService.GetCustomSweatersCount();
      break;
    case 'FabricTypes':
      response = await FabricTypesService.GetFabricTypesCount();
      break;
    case 'Languages':
      response = await LanguagesService.GetLanguagesCount();
      break;
    case 'Orders':
      response = await OrdersService.GetOrdersCount();
      break;
    case 'OrderHistory':
      response = await OrderHistoryService.GetOrderHistoryCount();
      break;
    case 'OrderStatuses':
      response = await OrderStatusesService.GetOrderStatusesCount();
      break;
    case 'PaymentMethods':
      response = await PaymentMethodsService.GetPaymentMethodsCount();
      break;
    case 'Payments':
      response = await PaymentsService.GetPaymentsCount();
      break;
    case 'PaymentStatuses':
      response = await PaymentStatusesService.GetPaymentStatusesCount();
      break;
    case 'ProductImages':
      response = await ProductImagesService.GetProductImagesCount();
      break;
    case 'ProductOrders':
      response = await ProductOrdersService.GetProductOrdersCount();
      break;
    case 'Products':
      response = await ProductsService.GetProductsCount();
      break;
    case 'ProductTranslations':
      response = await ProductTranslationsService.GetProductTranslationsCount();
      break;
    case 'Reviews':
      response = await ReviewsService.GetReviewsCount();
      break;
    case 'ShippingAddresses':
      response = await ShippingAddressesService.GetShippingAddressesCount();
      break;
    case 'SizeOptions':
      response = await SizeOptionsService.GetSizeOptionsCount();
      break;
    case 'UserOrderHistory':
      response = await UserOrderHistoryService.GetUserOrderHistoryCount();
      break;
    case 'UserProfiles':
      response = await UserProfilesService.GetUserProfilesCount();
      break;
    case 'UserRoles':
      response = await UserRolesService.GetUserRolesCount();
      break;
    case 'Users':
      response = await UsersService.GetUsersCount();
      break;
    default:
      break;
  };

  return response;
};