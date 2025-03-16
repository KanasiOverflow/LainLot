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

export const removeRecordById = async (currentTable, id) => {
  var response = null;

  switch (currentTable) {
    case 'About':
      response = await AboutService.DeleteAbout(id);
      break;
    case 'AccessLevels':
      response = await AccessLevelsService.DeleteAccessLevels(id);
      break;
    case 'BaseBelts':
      response = await BaseBeltsService.DeleteBaseBelts(id);
      break;
    case 'BaseNecklines':
      response = await BaseNecklinesService.DeleteBaseNecklines(id);
      break;
    case 'BasePantsCuffs':
      response = await BasePantsCuffsService.DeleteBasePantsCuffs(id);
      break;
    case 'BasePants':
      response = await BasePantsService.DeleteBasePants(id);
      break;
    case 'BaseSleeveCuffs':
      response = await BaseSleeveCuffsService.DeleteBaseSleeveCuffs(id);
      break;
    case 'BaseSleeves':
      response = await BaseSleevesService.DeleteBaseSleeves(id);
      break;
    case 'BaseSportSuits':
      response = await BaseSportSuitsService.DeleteBaseSportSuits(id);
      break;
    case 'BaseSweaters':
      response = await BaseSweatersService.DeleteBaseSweaters(id);
      break;
    case 'Cart':
      response = await CartService.DeleteCart(id);
      break;
    case 'Categories':
      response = await CategoriesService.DeleteCategories(id);
      break;
    case 'CategoryHierarchy':
      response = await CategoryHierarchyService.DeleteCategoryHierarchy(id);
      break;
    case 'Colors':
      response = await ColorsService.DeleteColors(id);
      break;
    case 'Contacts':
      response = await ContactsService.DeleteContacts(id);
      break;
    case 'Countries':
      response = await CountriesService.DeleteCountries(id);
      break;
    case 'Currencies':
      response = await CurrenciesService.DeleteCurrencies(id);
      break;
    case 'CustomBelts':
      response = await CustomBeltsService.DeleteCustomBelts(id);
      break;
    case 'CustomizableProducts':
      response =
        await CustomizableProductsService.DeleteCustomizableProducts(id);
      break;
    case 'CustomNecklines':
      response = await CustomNecklinesService.DeleteCustomNecklines(id);
      break;
    case 'CustomPantsCuffs':
      response = await CustomPantsCuffsService.DeleteCustomPantsCuffs(id);
      break;
    case 'CustomPants':
      response = await CustomPantsService.DeleteCustomPants(id);
      break;
    case 'CustomSleeveCuffs':
      response = await CustomSleeveCuffsService.DeleteCustomSleeveCuffs(id);
      break;
    case 'CustomSleeves':
      response = await CustomSleevesService.DeleteCustomSleeves(id);
      break;
    case 'CustomSportSuits':
      response = await CustomSportSuitsService.DeleteCustomSportSuits(id);
      break;
    case 'CustomSweaters':
      response = await CustomSweatersService.DeleteCustomSweaters(id);
      break;
    case 'FabricTypes':
      response = await FabricTypesService.DeleteFabricTypes(id);
      break;
    case 'Languages':
      response = await LanguagesService.DeleteLanguages(id);
      break;
    case 'Orders':
      response = await OrdersService.DeleteOrders(id);
      break;
    case 'OrderHistory':
      response = await OrderHistoryService.DeleteOrderHistory(id);
      break;
    case 'OrderStatuses':
      response = await OrderStatusesService.DeleteOrderStatuses(id);
      break;
    case 'PaymentMethods':
      response = await PaymentMethodsService.DeletePaymentMethods(id);
      break;
    case 'Payments':
      response = await PaymentsService.DeletePayments(id);
      break;
    case 'PaymentStatuses':
      response = await PaymentStatusesService.DeletePaymentStatuses(id);
      break;
    case 'ProductImages':
      response = await ProductImagesService.DeleteProductImages(id);
      break;
    case 'ProductOrders':
      response = await ProductOrdersService.DeleteProductOrders(id);
      break;
    case 'Products':
      response = await ProductsService.DeleteProducts(id);
      break;
    case 'ProductTranslations':
      response = await ProductTranslationsService.DeleteProductTranslations(id);
      break;
    case 'Reviews':
      response = await ReviewsService.DeleteReviews(id);
      break;
    case 'ShippingAddresses':
      response = await ShippingAddressesService.DeleteShippingAddresses(id);
      break;
    case 'SizeOptions':
      response = await SizeOptionsService.DeleteSizeOptions(id);
      break;
    case 'UserOrderHistory':
      response = await UserOrderHistoryService.DeleteUserOrderHistory(id);
      break;
    case 'UserProfiles':
      response = await UserProfilesService.DeleteUserProfiles(id);
      break;
    case 'UserRoles':
      response = await UserRolesService.DeleteUserRoles(id);
      break;
    case 'Users':
      response = await UsersService.DeleteUsers(id);
      break;
    default:
      break;
  }

  return response;
};
