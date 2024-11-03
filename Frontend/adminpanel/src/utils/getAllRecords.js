import AboutService from 'api/AboutService';
import AccessLevelsService from 'api/AccessLevelsService';
import CartService from 'api/CartService';
import CategoriesService from 'api/CategoriesService';
import CategoryHierarchyService from 'api/CategoryHierarchyService';
import ColorsService from 'api/ColorsService';
import ContactsService from 'api/ContactsService';
import CustomizableProductsService from 'api/CustomizableProductsService';
import CustomizationOrdersService from 'api/CustomizationOrdersService';
import FabricTypesService from 'api/FabricTypesService';
import LanguagesService from 'api/LanguagesService';
import OrdersService from 'api/OrdersService';
import OrderHistoryService from 'api/OrderHistoryService';
import OrderStatusesService from 'api/OrderStatusesService';
import PaymentsService from 'api/PaymentsService';
import ProductsService from 'api/ProductsService';
import ProductImagesService from 'api/ProductImagesService';
import ProductTranslationsService from 'api/ProductTranslationsService';
import ReviewsService from 'api/ReviewsService';
import UsersService from 'api/UsersService';
import UserProfilesService from 'api/UserProfilesService';
import UserRolesService from 'api/UserRolesService';

export const getAllRecords = async (currentTable, limit, page) => {

  var response = null;

  switch (currentTable) {
    case 'About':
      response = await AboutService.GetAbout(limit, page);
      break;
    case 'AccessLevels':
      response = await AccessLevelsService.GetAccessLevels(limit, page);
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
    case 'CustomizableProducts':
      response = await CustomizableProductsService.GetCustomizableProducts(limit, page);
      break;
    case 'CustomizationOrders':
      response = await CustomizationOrdersService.GetCustomizationOrders(limit, page);
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
    case 'Payments':
      response = await PaymentsService.GetPayments(limit, page);
      break;
    case 'Products':
      response = await ProductsService.GetProducts(limit, page);
      break;
    case 'ProductImages':
      response = await ProductImagesService.GetProductImages(limit, page);
      break;
    case 'ProductTranslations':
      response = await ProductTranslationsService.GetProductTranslations(limit, page);
      break;
    case 'Reviews':
      response = await ReviewsService.GetReviews(limit, page);
      break;
    case 'Users':
      response = await UsersService.GetUsers(limit, page);
      break;
    case 'UserProfiles':
      response = await UserProfilesService.GetUserProfiles(limit, page);
      break;
    case 'UserRoles':
      response = await UserRolesService.GetUserRoles(limit, page);
      break;
    default:
      break;
  };

  return response;
};