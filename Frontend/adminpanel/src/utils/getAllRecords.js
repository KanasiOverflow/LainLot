import AboutService from '../API/AboutService';
import AccessLevelsService from '../API/AccessLevelsService';
import ContactsService from '../API/ContactsService';
import LanguagesService from '../API/LanguagesService';
import PostsService from '../API/PostsService';
import PostsTranslationService from '../API/PostsTranslationsService';
import UsersService from '../API/UsersService';
import UserProfileService from '../API/UserProfileService';
import UserRolesService from '../API/UserRolesService';

export const getAllRecords = async (currentTable) => {

  var response = null;

  switch (currentTable) {
    case 'About':
      response = await AboutService.GetAbouts();
      break;
    case 'AccessLevels':
      response = await AccessLevelsService.GetAccessLevels();
      break;
    case 'Contacts':
      response = await ContactsService.GetContacts();
      break;
    case 'Languages':
      response = await LanguagesService.GetLanguages();
      break;
    case 'Posts':
      response = await PostsService.GetPosts();
      break;
    case 'PostsTranstations':
      response = await PostsTranslationService.GetPostsTranslations();
      break;
    case 'Users':
      response = await UsersService.GetUsers();
      break;
    case 'UserProfile':
      response = await UserProfileService.GetUserProfile();
      break;
    case 'UserRoles':
      response = await UserRolesService.GetUserRoles();
      break;
    default:
      break;
  };

  return response;
};