import AboutService from 'api/CRUD/AboutService';
import AccessLevelsService from 'api/CRUD/AccessLevelsService';
import CartService from 'api/CRUD/CartService';
import CategoriesService from 'api/CRUD/CategoriesService';
import CategoryHierarchyService from 'api/CRUD/CategoryHierarchyService';
import ColorsService from 'api/CRUD/ColorsService';
import ContactsService from 'api/CRUD/ContactsService';
import CustomizableProductsService from 'api/CRUD/CustomizableProductsService';
import CustomizationOrdersService from 'api/CRUD/CustomizationOrdersService';
import FabricTypesService from 'api/CRUD/FabricTypesService';
import LanguagesService from 'api/CRUD/LanguagesService';
import OrdersService from 'api/CRUD/OrdersService';
import OrderHistoryService from 'api/CRUD/OrderHistoryService';
import OrderStatusesService from 'api/CRUD/OrderStatusesService';
import PaymentsService from 'api/CRUD/PaymentsService';
import ProductsService from 'api/CRUD/ProductsService';
import ProductImagesService from 'api/CRUD/ProductImagesService';
import ProductTranslationsService from 'api/CRUD/ProductTranslationsService';
import ReviewsService from 'api/CRUD/ReviewsService';
import UsersService from 'api/CRUD/UsersService';
import UserProfilesService from 'api/CRUD/UserProfilesService';
import UserRolesService from 'api/CRUD/UserRolesService';

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