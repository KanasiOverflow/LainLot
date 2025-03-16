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

export const getAllRecords = async (currentTable, limit, page) => {
  var response = null;

  switch (currentTable) {
    case 'About':
      response = await AboutService.GetAbout(limit, page);
      break;
    case 'AccessLevels':
      response = await AccessLevelsService.GetAccessLevels(limit, page);
      break;
    case 'BaseBelts':
      response = await BaseBeltsService.GetBaseBelts(limit, page);
      break;
    case 'BaseNecklines':
      response = await BaseNecklinesService.GetBaseNecklines(limit, page);
      break;
    case 'BasePantsCuffs':
      response = await BasePantsCuffsService.GetBasePantsCuffs(limit, page);
      break;
    case 'BasePants':
      response = await BasePantsService.GetBasePants(limit, page);
      break;
    case 'BaseSleeveCuffs':
      response = await BaseSleeveCuffsService.GetBaseSleeveCuffs(limit, page);
      break;
    case 'BaseSleeves':
      response = await BaseSleevesService.GetBaseSleeves(limit, page);
      break;
    case 'BaseSportSuits':
      response = await BaseSportSuitsService.GetBaseSportSuits(limit, page);
      break;
    case 'BaseSweaters':
      response = await BaseSweatersService.GetBaseSweaters(limit, page);
      break;
    case 'Cart':
      response = await CartService.GetCart(limit, page);
      break;
    case 'Categories':
      response = await CategoriesService.GetCategories(limit, page);
      break;
    case 'CategoryHierarchy':
      response = await CategoryHierarchyService.GetCategoryHierarchy(
        limit,
        page,
      );
      break;
    case 'Colors':
      response = await ColorsService.GetColors(limit, page);
      break;
    case 'Contacts':
      response = await ContactsService.GetContacts(limit, page);
      break;
    case 'Countries':
      response = await CountriesService.GetCountries(limit, page);
      break;
    case 'Currencies':
      response = await CurrenciesService.GetCurrencies(limit, page);
      break;
    case 'CustomBelts':
      response = await CustomBeltsService.GetCustomBelts(limit, page);
      break;
    case 'CustomizableProducts':
      response = await CustomizableProductsService.GetCustomizableProducts(
        limit,
        page,
      );
      break;
    case 'CustomNecklines':
      response = await CustomNecklinesService.GetCustomNecklines(limit, page);
      break;
    case 'CustomPantsCuffs':
      response = await CustomPantsCuffsService.GetCustomPantsCuffs(limit, page);
      break;
    case 'CustomPants':
      response = await CustomPantsService.GetCustomPants(limit, page);
      break;
    case 'CustomSleeveCuffs':
      response = await CustomSleeveCuffsService.GetCustomSleeveCuffs(
        limit,
        page,
      );
      break;
    case 'CustomSleeves':
      response = await CustomSleevesService.GetCustomSleeves(limit, page);
      break;
    case 'CustomSportSuits':
      response = await CustomSportSuitsService.GetCustomSportSuits(limit, page);
      break;
    case 'CustomSweaters':
      response = await CustomSweatersService.GetCustomSweaters(limit, page);
      break;
    case 'FabricTypes':
      response = await FabricTypesService.GetFabricTypes(limit, page);
      break;
    case 'Languages':
      response = await LanguagesService.GetLanguages(limit, page);
      break;
    case 'Orders':
      response = await OrdersService.GetOrders(limit, page);
      break;
    case 'OrderHistory':
      response = await OrderHistoryService.GetOrderHistory(limit, page);
      break;
    case 'OrderStatuses':
      response = await OrderStatusesService.GetOrderStatuses(limit, page);
      break;
    case 'PaymentMethods':
      response = await PaymentMethodsService.GetPaymentMethods(limit, page);
      break;
    case 'Payments':
      response = await PaymentsService.GetPayments(limit, page);
      break;
    case 'PaymentStatuses':
      response = await PaymentStatusesService.GetPaymentStatuses(limit, page);
      break;
    case 'ProductImages':
      response = await ProductImagesService.GetProductImages(limit, page);
      break;
    case 'ProductOrders':
      response = await ProductOrdersService.GetProductOrders(limit, page);
      break;
    case 'Products':
      response = await ProductsService.GetProducts(limit, page);
      break;
    case 'ProductTranslations':
      response = await ProductTranslationsService.GetProductTranslations(
        limit,
        page,
      );
      break;
    case 'Reviews':
      response = await ReviewsService.GetReviews(limit, page);
      break;
    case 'ShippingAddresses':
      response = await ShippingAddressesService.GetShippingAddresses(
        limit,
        page,
      );
      break;
    case 'SizeOptions':
      response = await SizeOptionsService.GetSizeOptions(limit, page);
      break;
    case 'UserOrderHistory':
      response = await UserOrderHistoryService.GetUserOrderHistory(limit, page);
      break;
    case 'UserProfiles':
      response = await UserProfilesService.GetUserProfiles(limit, page);
      break;
    case 'UserRoles':
      response = await UserRolesService.GetUserRoles(limit, page);
      break;
    case 'Users':
      response = await UsersService.GetUsers(limit, page);
      break;
    default:
      break;
  }

  return response;
};
