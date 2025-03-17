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

export const removeRecordById = async (currentTable, id, login, password) => {
  var response = null;

  switch (currentTable) {
    case 'About':
      response = await AboutService.DeleteAbout(id, login, password);
      break;
    case 'AccessLevels':
      response = await AccessLevelsService.DeleteAccessLevels(id, login, password);
      break;
    case 'BaseBelts':
      response = await BaseBeltsService.DeleteBaseBelts(id, login, password);
      break;
    case 'BaseNecklines':
      response = await BaseNecklinesService.DeleteBaseNecklines(id, login, password);
      break;
    case 'BasePantsCuffs':
      response = await BasePantsCuffsService.DeleteBasePantsCuffs(id, login, password);
      break;
    case 'BasePants':
      response = await BasePantsService.DeleteBasePants(id, login, password);
      break;
    case 'BaseSleeveCuffs':
      response = await BaseSleeveCuffsService.DeleteBaseSleeveCuffs(id, login, password);
      break;
    case 'BaseSleeves':
      response = await BaseSleevesService.DeleteBaseSleeves(id, login, password);
      break;
    case 'BaseSportSuits':
      response = await BaseSportSuitsService.DeleteBaseSportSuits(id, login, password);
      break;
    case 'BaseSweaters':
      response = await BaseSweatersService.DeleteBaseSweaters(id, login, password);
      break;
    case 'Cart':
      response = await CartService.DeleteCart(id, login, password);
      break;
    case 'Categories':
      response = await CategoriesService.DeleteCategories(id, login, password);
      break;
    case 'CategoryHierarchy':
      response = await CategoryHierarchyService.DeleteCategoryHierarchy(id, login, password);
      break;
    case 'Colors':
      response = await ColorsService.DeleteColors(id, login, password);
      break;
    case 'Contacts':
      response = await ContactsService.DeleteContacts(id, login, password);
      break;
    case 'Countries':
      response = await CountriesService.DeleteCountries(id, login, password);
      break;
    case 'Currencies':
      response = await CurrenciesService.DeleteCurrencies(id, login, password);
      break;
    case 'CustomBelts':
      response = await CustomBeltsService.DeleteCustomBelts(id, login, password);
      break;
    case 'CustomizableProducts':
      response = await CustomizableProductsService.DeleteCustomizableProducts(id, login, password);
      break;
    case 'CustomNecklines':
      response = await CustomNecklinesService.DeleteCustomNecklines(id, login, password);
      break;
    case 'CustomPantsCuffs':
      response = await CustomPantsCuffsService.DeleteCustomPantsCuffs(id, login, password);
      break;
    case 'CustomPants':
      response = await CustomPantsService.DeleteCustomPants(id, login, password);
      break;
    case 'CustomSleeveCuffs':
      response = await CustomSleeveCuffsService.DeleteCustomSleeveCuffs(id, login, password);
      break;
    case 'CustomSleeves':
      response = await CustomSleevesService.DeleteCustomSleeves(id, login, password);
      break;
    case 'CustomSportSuits':
      response = await CustomSportSuitsService.DeleteCustomSportSuits(id, login, password);
      break;
    case 'CustomSweaters':
      response = await CustomSweatersService.DeleteCustomSweaters(id, login, password);
      break;
    case 'FabricTypes':
      response = await FabricTypesService.DeleteFabricTypes(id, login, password);
      break;
    case 'Languages':
      response = await LanguagesService.DeleteLanguages(id, login, password);
      break;
    case 'Orders':
      response = await OrdersService.DeleteOrders(id, login, password);
      break;
    case 'OrderHistory':
      response = await OrderHistoryService.DeleteOrderHistory(id, login, password);
      break;
    case 'OrderStatuses':
      response = await OrderStatusesService.DeleteOrderStatuses(id, login, password);
      break;
    case 'PaymentMethods':
      response = await PaymentMethodsService.DeletePaymentMethods(id, login, password);
      break;
    case 'Payments':
      response = await PaymentsService.DeletePayments(id, login, password);
      break;
    case 'PaymentStatuses':
      response = await PaymentStatusesService.DeletePaymentStatuses(id, login, password);
      break;
    case 'ProductImages':
      response = await ProductImagesService.DeleteProductImages(id, login, password);
      break;
    case 'ProductOrders':
      response = await ProductOrdersService.DeleteProductOrders(id, login, password);
      break;
    case 'Products':
      response = await ProductsService.DeleteProducts(id, login, password);
      break;
    case 'ProductTranslations':
      response = await ProductTranslationsService.DeleteProductTranslations(id, login, password);
      break;
    case 'Reviews':
      response = await ReviewsService.DeleteReviews(id, login, password);
      break;
    case 'ShippingAddresses':
      response = await ShippingAddressesService.DeleteShippingAddresses(id, login, password);
      break;
    case 'SizeOptions':
      response = await SizeOptionsService.DeleteSizeOptions(id, login, password);
      break;
    case 'UserOrderHistory':
      response = await UserOrderHistoryService.DeleteUserOrderHistory(id, login, password);
      break;
    case 'UserProfiles':
      response = await UserProfilesService.DeleteUserProfiles(id, login, password);
      break;
    case 'UserRoles':
      response = await UserRolesService.DeleteUserRoles(id, login, password);
      break;
    case 'Users':
      response = await UsersService.DeleteUsers(id, login, password);
      break;
    default:
      break;
  };

  return response;
}