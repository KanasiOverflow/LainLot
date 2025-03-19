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

export const getAllRecords = async (
  currentTable,
  limit,
  page,
  login,
  password
) => {
  var response = null;

  switch (currentTable) {
    case 'About':
      response = await AboutService.GetAbout(limit, page, login, password);
      break;
    case 'AccessLevels':
      response = await AccessLevelsService.GetAccessLevels(
        limit,
        page,
        login,
        password
      );
      break;
    case 'BaseBelts':
      response = await BaseBeltsService.GetBaseBelts(
        limit,
        page,
        login,
        password
      );
      break;
    case 'BaseNecklines':
      response = await BaseNecklinesService.GetBaseNecklines(
        limit,
        page,
        login,
        password
      );
      break;
    case 'BasePantsCuffs':
      response = await BasePantsCuffsService.GetBasePantsCuffs(
        limit,
        page,
        login,
        password
      );
      break;
    case 'BasePants':
      response = await BasePantsService.GetBasePants(
        limit,
        page,
        login,
        password
      );
      break;
    case 'BaseSleeveCuffs':
      response = await BaseSleeveCuffsService.GetBaseSleeveCuffs(
        limit,
        page,
        login,
        password
      );
      break;
    case 'BaseSleeves':
      response = await BaseSleevesService.GetBaseSleeves(
        limit,
        page,
        login,
        password
      );
      break;
    case 'BaseSportSuits':
      response = await BaseSportSuitsService.GetBaseSportSuits(
        limit,
        page,
        login,
        password
      );
      break;
    case 'BaseSweaters':
      response = await BaseSweatersService.GetBaseSweaters(
        limit,
        page,
        login,
        password
      );
      break;
    case 'Cart':
      response = await CartService.GetCart(limit, page, login, password);
      break;
    case 'Categories':
      response = await CategoriesService.GetCategories(
        limit,
        page,
        login,
        password
      );
      break;
    case 'CategoryHierarchy':
      response = await CategoryHierarchyService.GetCategoryHierarchy(
        limit,
        page,
        login,
        password
      );
      break;
    case 'Colors':
      response = await ColorsService.GetColors(limit, page, login, password);
      break;
    case 'Contacts':
      response = await ContactsService.GetContacts(
        limit,
        page,
        login,
        password
      );
      break;
    case 'Countries':
      response = await CountriesService.GetCountries(
        limit,
        page,
        login,
        password
      );
      break;
    case 'Currencies':
      response = await CurrenciesService.GetCurrencies(
        limit,
        page,
        login,
        password
      );
      break;
    case 'CustomBelts':
      response = await CustomBeltsService.GetCustomBelts(
        limit,
        page,
        login,
        password
      );
      break;
    case 'CustomizableProducts':
      response = await CustomizableProductsService.GetCustomizableProducts(
        limit,
        page,
        login,
        password
      );
      break;
    case 'CustomNecklines':
      response = await CustomNecklinesService.GetCustomNecklines(
        limit,
        page,
        login,
        password
      );
      break;
    case 'CustomPantsCuffs':
      response = await CustomPantsCuffsService.GetCustomPantsCuffs(
        limit,
        page,
        login,
        password
      );
      break;
    case 'CustomPants':
      response = await CustomPantsService.GetCustomPants(
        limit,
        page,
        login,
        password
      );
      break;
    case 'CustomSleeveCuffs':
      response = await CustomSleeveCuffsService.GetCustomSleeveCuffs(
        limit,
        page,
        login,
        password
      );
      break;
    case 'CustomSleeves':
      response = await CustomSleevesService.GetCustomSleeves(
        limit,
        page,
        login,
        password
      );
      break;
    case 'CustomSportSuits':
      response = await CustomSportSuitsService.GetCustomSportSuits(
        limit,
        page,
        login,
        password
      );
      break;
    case 'CustomSweaters':
      response = await CustomSweatersService.GetCustomSweaters(
        limit,
        page,
        login,
        password
      );
      break;
    case 'FabricTypes':
      response = await FabricTypesService.GetFabricTypes(
        limit,
        page,
        login,
        password
      );
      break;
    case 'Languages':
      response = await LanguagesService.GetLanguages(
        limit,
        page,
        login,
        password
      );
      break;
    case 'Orders':
      response = await OrdersService.GetOrders(limit, page, login, password);
      break;
    case 'OrderHistory':
      response = await OrderHistoryService.GetOrderHistory(
        limit,
        page,
        login,
        password
      );
      break;
    case 'OrderStatuses':
      response = await OrderStatusesService.GetOrderStatuses(
        limit,
        page,
        login,
        password
      );
      break;
    case 'PaymentMethods':
      response = await PaymentMethodsService.GetPaymentMethods(
        limit,
        page,
        login,
        password
      );
      break;
    case 'Payments':
      response = await PaymentsService.GetPayments(
        limit,
        page,
        login,
        password
      );
      break;
    case 'PaymentStatuses':
      response = await PaymentStatusesService.GetPaymentStatuses(
        limit,
        page,
        login,
        password
      );
      break;
    case 'ProductImages':
      response = await ProductImagesService.GetProductImages(
        limit,
        page,
        login,
        password
      );
      break;
    case 'ProductOrders':
      response = await ProductOrdersService.GetProductOrders(
        limit,
        page,
        login,
        password
      );
      break;
    case 'Products':
      response = await ProductsService.GetProducts(
        limit,
        page,
        login,
        password
      );
      break;
    case 'ProductTranslations':
      response = await ProductTranslationsService.GetProductTranslations(
        limit,
        page,
        login,
        password
      );
      break;
    case 'Reviews':
      response = await ReviewsService.GetReviews(limit, page, login, password);
      break;
    case 'ShippingAddresses':
      response = await ShippingAddressesService.GetShippingAddresses(
        limit,
        page,
        login,
        password
      );
      break;
    case 'SizeOptions':
      response = await SizeOptionsService.GetSizeOptions(
        limit,
        page,
        login,
        password
      );
      break;
    case 'UserOrderHistory':
      response = await UserOrderHistoryService.GetUserOrderHistory(
        limit,
        page,
        login,
        password
      );
      break;
    case 'UserProfiles':
      response = await UserProfilesService.GetUserProfiles(
        limit,
        page,
        login,
        password
      );
      break;
    case 'UserRoles':
      response = await UserRolesService.GetUserRoles(
        limit,
        page,
        login,
        password
      );
      break;
    case 'Users':
      response = await UsersService.GetUsers(limit, page, login, password);
      break;
    default:
      break;
  }

  return response;
};
