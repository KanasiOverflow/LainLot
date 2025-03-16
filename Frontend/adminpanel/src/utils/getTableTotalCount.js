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
    case 'BaseSportSuits':
      response = await BaseSportSuitsService.GetBaseSportSuitsCount();
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
      response =
        await CustomizableProductsService.GetCustomizableProductsCount();
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
    case 'CustomSportSuits':
      response = await CustomSportSuitsService.GetCustomSportSuitsCount();
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
  }

  return response;
};
