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
      response = await BaseSportSuitsService.GetBaseSportSuit(limit, page);
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
      response = await CategoryHierarchyService.GetCategoryHierarchy(limit, page);
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
      response = await CustomizableProductsService.GetCustomizableProducts(limit, page);
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
      response = await CustomSleeveCuffsService.GetCustomSleeveCuffs(limit, page);
      break;
    case 'CustomSleeves':
      response = await CustomSleevesService.GetCustomSleeves(limit, page);
      break;
    case 'CustomSportSuits':
      response = await CustomSportSuitsService.GetCustomSportSuit(limit, page);
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
      response = await ProductTranslationsService.GetProductTranslations(limit, page);
      break;
    case 'Reviews':
      response = await ReviewsService.GetReviews(limit, page);
      break;
    case 'ShippingAddresses':
      response = await ShippingAddressesService.GetShippingAddresses(limit, page);
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
  };

  return response;
};