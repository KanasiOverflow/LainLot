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

export const getRecordFields = async (currentTable) => {

  var response = null;

  switch (currentTable) {
    case 'About':
      response = await AboutService.GetAboutFields();
      break;
    case 'AccessLevels':
      response = await AccessLevelsService.GetAccessLevelsFields();
      break;
    case 'Cart':
      response = await CartService.GetCartFields();
      break;
    case 'Categories':
      response = await CategoriesService.GetCategoriesFields();
      break;
    case 'CategoryHierarchy':
      response = await CategoryHierarchyService.GetCategoryHierarchyFields();
      break;
    case 'Colors':
      response = await ColorsService.GetColorsFields();
      break;
    case 'Contacts':
      response = await ContactsService.GetContactsFields();
      break;
    case 'CustomizableProducts':
      response = await CustomizableProductsService.GetCustomizableProductsFields();
      break;
    case 'CustomizationOrders':
      response = await CustomizationOrdersService.GetCustomizationOrdersFields();
      break;
    case 'FabricTypes':
      response = await FabricTypesService.GetFabricTypesFields();
      break;
    case 'Languages':
      response = await LanguagesService.GetLanguagesFields();
      break;
    case 'Orders':
      response = await OrdersService.GetOrdersFields();
      break;
    case 'OrderHistory':
      response = await OrderHistoryService.GetOrderHistoryFields();
      break;
    case 'OrderStatuses':
      response = await OrderStatusesService.GetOrderStatusesFields();
      break;
    case 'Payments':
      response = await PaymentsService.GetPaymentsFields();
      break;
    case 'Products':
      response = await ProductsService.GetProductsFields();
      break;
    case 'ProductImages':
      response = await ProductImagesService.GetProductImagesFields();
      break;
    case 'ProductTranslations':
      response = await ProductTranslationsService.GetProductTranslationsFields();
      break;
    case 'Reviews':
      response = await ReviewsService.GetReviewsFields();
      break;
    case 'Users':
      response = await UsersService.GetUsersFields();
      break;
    case 'UserProfiles':
      response = await UserProfilesService.GetUserProfilesFields();
      break;
    case 'UserRoles':
      response = await UserRolesService.GetUserRolesFields();
      break;
    default:
      break;
  };

  return response;
};