import AboutService from '../API/AboutService';
import AccessLevelsService from '../API/AccessLevelsService';
import CartService from '../API/CartService';
import CategoriesService from '../API/CategoriesService';
import CategoryHierarchyService from '../API/CategoryHierarchyService';
import ColorsService from '../API/ColorsService';
import ContactsService from '../API/ContactsService';
import CustomizableProductsService from '../API/CustomizableProductsService';
import CustomizationOrdersService from '../API/CustomizationOrdersService';
import FabricTypesService from '../API/FabricTypesService';
import LanguagesService from '../API/LanguagesService';
import OrdersService from '../API/OrdersService';
import OrderHistoryService from '../API/OrderHistoryService';
import OrderStatusesService from '../API/OrderStatusesService';
import PaymentsService from '../API/PaymentsService';
import ProductsService from '../API/ProductsService';
import ProductImagesService from '../API/ProductImagesService';
import ProductTranslationsService from '../API/ProductTranslationsService';
import ReviewsService from '../API/ReviewsService';
import UsersService from '../API/UsersService';
import UserProfilesService from '../API/UserProfilesService';
import UserRolesService from '../API/UserRolesService';

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