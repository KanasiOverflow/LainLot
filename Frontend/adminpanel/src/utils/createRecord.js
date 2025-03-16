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

export const createRecord = async (currentTable, data) => {
  var response = null;

  switch (currentTable) {
    case 'About':
      response = await AboutService.CreateAbout(data);
      break;
    case 'AccessLevels':
      response = await AccessLevelsService.CreateAccessLevels(data);
      break;
    case 'BaseBelts':
      response = await BaseBeltsService.CreateBaseBelts(data);
      break;
    case 'BaseNecklines':
      response = await BaseNecklinesService.CreateBaseNecklines(data);
      break;
    case 'BasePantsCuffs':
      response = await BasePantsCuffsService.CreateBasePantsCuffs(data);
      break;
    case 'BasePants':
      response = await BasePantsService.CreateBasePants(data);
      break;
    case 'BaseSleeveCuffs':
      response = await BaseSleeveCuffsService.CreateBaseSleeveCuffs(data);
      break;
    case 'BaseSleeves':
      response = await BaseSleevesService.CreateBaseSleeves(data);
      break;
    case 'BaseSportSuits':
      response = await BaseSportSuitsService.CreateBaseSportSuits(data);
      break;
    case 'BaseSweaters':
      response = await BaseSweatersService.CreateBaseSweaters(data);
      break;
    case 'Cart':
      response = await CartService.CreateCart(data);
      break;
    case 'Categories':
      response = await CategoriesService.CreateCategories(data);
      break;
    case 'CategoryHierarchy':
      response = await CategoryHierarchyService.CreateCategoryHierarchy(data);
      break;
    case 'Colors':
      response = await ColorsService.CreateColors(data);
      break;
    case 'Contacts':
      response = await ContactsService.CreateContacts(data);
      break;
    case 'Countries':
      response = await CountriesService.CreateCountries(data);
      break;
    case 'Currencies':
      response = await CurrenciesService.CreateCurrencies(data);
      break;
    case 'CustomBelts':
      response = await CustomBeltsService.CreateCustomBelts(data);
      break;
    case 'CustomizableProducts':
      response =
        await CustomizableProductsService.CreateCustomizableProducts(data);
      break;
    case 'CustomNecklines':
      response = await CustomNecklinesService.CreateCustomNecklines(data);
      break;
    case 'CustomPantsCuffs':
      response = await CustomPantsCuffsService.CreateCustomPantsCuffs(data);
      break;
    case 'CustomPants':
      response = await CustomPantsService.CreateCustomPants(data);
      break;
    case 'CustomSleeveCuffs':
      response = await CustomSleeveCuffsService.CreateCustomSleeveCuffs(data);
      break;
    case 'CustomSleeves':
      response = await CustomSleevesService.CreateCustomSleeves(data);
      break;
    case 'CustomSportSuits':
      response = await CustomSportSuitsService.CreateCustomSportSuits(data);
      break;
    case 'CustomSweaters':
      response = await CustomSweatersService.CreateCustomSweaters(data);
      break;
    case 'FabricTypes':
      response = await FabricTypesService.CreateFabricTypes(data);
      break;
    case 'Languages':
      response = await LanguagesService.CreateLanguages(data);
      break;
    case 'Orders':
      response = await OrdersService.CreateOrders(data);
      break;
    case 'OrderHistory':
      response = await OrderHistoryService.CreateOrderHistory(data);
      break;
    case 'OrderStatuses':
      response = await OrderStatusesService.CreateOrderStatuses(data);
      break;
    case 'PaymentMethods':
      response = await PaymentMethodsService.CreatePaymentMethods(data);
      break;
    case 'Payments':
      response = await PaymentsService.CreatePayments(data);
      break;
    case 'PaymentStatuses':
      response = await PaymentStatusesService.CreatePaymentStatuses(data);
      break;
    case 'ProductImages':
      response = await ProductImagesService.CreateProductImages(data);
      break;
    case 'ProductOrders':
      response = await ProductOrdersService.CreateProductOrders(data);
      break;
    case 'Products':
      response = await ProductsService.CreateProducts(data);
      break;
    case 'ProductTranslations':
      response =
        await ProductTranslationsService.CreateProductTranslations(data);
      break;
    case 'Reviews':
      response = await ReviewsService.CreateReviews(data);
      break;
    case 'ShippingAddresses':
      response = await ShippingAddressesService.CreateShippingAddresses(data);
      break;
    case 'SizeOptions':
      response = await SizeOptionsService.CreateSizeOptions(data);
      break;
    case 'UserOrderHistory':
      response = await UserOrderHistoryService.CreateUserOrderHistory(data);
      break;
    case 'UserProfiles':
      response = await UserProfilesService.CreateUserProfiles(data);
      break;
    case 'UserRoles':
      response = await UserRolesService.CreateUserRoles(data);
      break;
    case 'Users':
      response = await UsersService.CreateUsers(data);
      break;
    default:
      break;
  }

  return response;
};
