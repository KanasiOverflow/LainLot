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