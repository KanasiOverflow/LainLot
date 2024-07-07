import AboutService from '../API/AboutService';
import AccessLevelsService from '../API/AccessLevelsService';
import ContactsService from '../API/ContactsService';
import LanguagesService from '../API/LanguagesService';
import PostsService from '../API/PostsService';
import PostsTranslationService from '../API/PostsTranslationsService';
import UsersService from '../API/UsersService';
import UserProfileService from '../API/UserProfileService';
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
    case 'Contacts':
      response = await ContactsService.GetContacts(limit, page);
      break;
    case 'Languages':
      response = await LanguagesService.GetLanguages(limit, page);
      break;
    case 'Posts':
      response = await PostsService.GetPosts(limit, page);
      break;
    case 'PostsTranstations':
      response = await PostsTranslationService.GetPostsTranslations(limit, page);
      break;
    case 'Users':
      response = await UsersService.GetUsers(limit, page);
      break;
    case 'UserProfile':
      response = await UserProfileService.GetUserProfiles(limit, page);
      break;
    case 'UserRoles':
      response = await UserRolesService.GetUserRoles(limit, page);
      break;
    default:
      break;
  };

  return response;
};