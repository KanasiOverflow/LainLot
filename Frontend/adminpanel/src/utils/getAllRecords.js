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
import CustomSportSuitService from 'api/CRUD/CustomSportSuitService';
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
      response = await AboutService.GetAbout(data);
      break;
    case 'AccessLevels':
      response = await AccessLevelsService.GetAccessLevels(data);
      break;
    case 'BaseBelts':
      response = await BaseBeltsService.GetBaseBelts(data);
      break;
    case 'BaseNecklines':
      response = await BaseNecklinesService.GetBaseNecklines(data);
      break;
    case 'BasePantsCuffs':
      response = await BasePantsCuffsService.GetBasePantsCuffs(data);
      break;
    case 'BasePants':
      response = await BasePantsService.GetBasePants(data);
      break;
    case 'BaseSleeveCuffs':
      response = await BaseSleeveCuffsService.GetBaseSleeveCuffs(data);
      break;
    case 'BaseSleeves':
      response = await BaseSleevesService.GetBaseSleeves(data);
      break;
    case 'BaseSportSuit':
      response = await BaseSportSuitService.GetBaseSportSuit(data);
      break;
    case 'BaseSweaters':
      response = await BaseSweatersService.GetBaseSweaters(data);
      break;
    case 'Cart':
      response = await CartService.GetCart(data);
      break;
    case 'Categories':
      response = await CategoriesService.GetCategories(data);
      break;
    case 'CategoryHierarchy':
      response = await CategoryHierarchyService.GetCategoryHierarchy(data);
      break;
    case 'Colors':
      response = await ColorsService.GetColors(data);
      break;
    case 'Contacts':
      response = await ContactsService.GetContacts(data);
      break;
    case 'Countries':
      response = await CountriesService.GetCountries(data);
      break;
    case 'Currencies':
      response = await CurrenciesService.GetCurrencies(data);
      break;
    case 'CustomBelts':
      response = await CustomBeltsService.GetCustomBelts(data);
      break;
    case 'CustomizableProducts':
      response = await CustomizableProductsService.GetCustomizableProducts(data);
      break;
    case 'CustomNecklines':
      response = await CustomNecklinesService.GetCustomNecklines(data);
      break;
    case 'CustomPantsCuffs':
      response = await CustomPantsCuffsService.GetCustomPantsCuffs(data);
      break;
    case 'CustomPants':
      response = await CustomPantsService.GetCustomPants(data);
      break;
    case 'CustomSleeveCuffs':
      response = await CustomSleeveCuffsService.GetCustomSleeveCuffs(data);
      break;
    case 'CustomSleeves':
      response = await CustomSleevesService.GetCustomSleeves(data);
      break;
    case 'CustomSportSuit':
      response = await CustomSportSuitService.GetCustomSportSuit(data);
      break;
    case 'CustomSweaters':
      response = await CustomSweatersService.GetCustomSweaters(data);
      break;
    case 'FabricTypes':
      response = await FabricTypesService.GetFabricTypes(data);
      break;
    case 'Languages':
      response = await LanguagesService.GetLanguages(data);
      break;
    case 'Orders':
      response = await OrdersService.GetOrders(data);
      break;
    case 'OrderHistory':
      response = await OrderHistoryService.GetOrderHistory(data);
      break;
    case 'OrderStatuses':
      response = await OrderStatusesService.GetOrderStatuses(data);
      break;
    case 'PaymentMethods':
      response = await PaymentMethodsService.GetPaymentMethods(data);
      break;
    case 'Payments':
      response = await PaymentsService.GetPayments(data);
      break;
    case 'PaymentStatuses':
      response = await PaymentStatusesService.GetPaymentStatuses(data);
      break;
    case 'ProductImages':
      response = await ProductImagesService.GetProductImages(data);
      break;
    case 'ProductOrders':
      response = await ProductOrdersService.GetProductOrders(data);
      break;
    case 'Products':
      response = await ProductsService.GetProducts(data);
      break;
    case 'ProductTranslations':
      response = await ProductTranslationsService.GetProductTranslations(data);
      break;
    case 'Reviews':
      response = await ReviewsService.GetReviews(data);
      break;
    case 'ShippingAddresses':
      response = await ShippingAddressesService.GetShippingAddresses(data);
      break;
    case 'SizeOptions':
      response = await SizeOptionsService.GetSizeOptions(data);
      break;
    case 'UserOrderHistory':
      response = await UserOrderHistoryService.GetUserOrderHistory(data);
      break;
    case 'UserProfiles':
      response = await UserProfilesService.GetUserProfiles(data);
      break;
    case 'UserRoles':
      response = await UserRolesService.GetUserRoles(data);
      break;
    case 'Users':
      response = await UsersService.GetUsers(data);
      break;
    default:
      break;
  };

  return response;
};