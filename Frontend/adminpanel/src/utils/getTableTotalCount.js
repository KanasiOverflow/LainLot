import AboutService from '../API/AboutService';
import AccessLevelsService from '../API/AccessLevelsService';
import ContactsService from '../API/ContactsService';
import LanguagesService from '../API/LanguagesService';
import PostsService from '../API/PostsService';
import PostsTranslationService from '../API/PostsTranslationsService';
import UsersService from '../API/UsersService';
import UserProfileService from '../API/UserProfileService';
import UserRolesService from '../API/UserRolesService';

export const getTableTotalCount = async (currentTable) => {

  var response = null;

  switch (currentTable) {
    case 'About':
      response = await AboutService.GetAboutCount();
      break;
    case 'AccessLevels':
      response = await AccessLevelsService.GetAccessLevelsCount();
      break;
    case 'Contacts':
      response = await ContactsService.GetContactsCount();
      break;
    case 'Languages':
      response = await LanguagesService.GetLanguagesCount();
      break;
    case 'Posts':
      response = await PostsService.GetPostsCount();
      break;
    case 'PostsTranstations':
      response = await PostsTranslationService.GetPostsTranslationsCount();
      break;
    case 'Users':
      response = await UsersService.GetUsersCount();
      break;
    case 'UserProfile':
      response = await UserProfileService.GetUserProfilesCount();
      break;
    case 'UserRoles':
      response = await UserRolesService.GetUserRolesCount();
      break;
    default:
      break;
  };

  return response;
};