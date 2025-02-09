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

export const getTableTotalCount = async (currentTable) => {

  var response = null;

  switch (currentTable) {
    case 'About':
      response = await AboutService.GetAboutCount();
      break;
    case 'AccessLevels':
      response = await AccessLevelsService.GetAccessLevelsCount();
      break;
    case 'Cart':
      response = await CartService.GetCartCount();
      break;
    case 'Categories':
      response = await CategoriesService.GetCategoriesCount();
      break;
    case 'CategoryHierarchy':
      response = await CategoryHierarchyService.GetCategoryHierarchyCount();
      break;
    case 'Colors':
      response = await ColorsService.GetColorsCount();
      break;
    case 'Contacts':
      response = await ContactsService.GetContactsCount();
      break;
    case 'CustomizableProducts':
      response = await CustomizableProductsService.GetCustomizableProductsCount();
      break;
    case 'CustomizationOrders':
      response = await CustomizationOrdersService.GetCustomizationOrdersCount();
      break;
    case 'FabricTypes':
      response = await FabricTypesService.GetFabricTypesCount();
      break;
    case 'Languages':
      response = await LanguagesService.GetLanguagesCount();
      break;
    case 'Orders':
      response = await OrdersService.GetOrdersCount();
      break;
    case 'OrderHistory':
      response = await OrderHistoryService.GetOrderHistoryCount();
      break;
    case 'OrderStatuses':
      response = await OrderStatusesService.GetOrderStatusesCount();
      break;
    case 'Payments':
      response = await PaymentsService.GetPaymentsCount();
      break;
    case 'Products':
      response = await ProductsService.GetProductsCount();
      break;
    case 'ProductImages':
      response = await ProductImagesService.GetProductImagesCount();
      break;
    case 'ProductTranslations':
      response = await ProductTranslationsService.GetProductTranslationsCount();
      break;
    case 'Reviews':
      response = await ReviewsService.GetReviewsCount();
      break;
    case 'Users':
      response = await UsersService.GetUsersCount();
      break;
    case 'UserProfiles':
      response = await UserProfilesService.GetUserProfilesCount();
      break;
    case 'UserRoles':
      response = await UserRolesService.GetUserRolesCount();
      break;
    default:
      break;
  };

  return response;
};