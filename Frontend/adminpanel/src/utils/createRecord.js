import AboutService from '../API/AboutService';
import AccessLevelsService from '../API/AccessLevelsService';
import ContactsService from '../API/ContactsService';
import LanguagesService from '../API/LanguagesService';
import PostsService from '../API/PostsService';
import PostsTranslationService from '../API/PostsTranslationsService';
import UsersService from '../API/UsersService';
import UserProfileService from '../API/UserProfileService';
import UserRolesService from '../API/UserRolesService';

export const createRecord = async (currentTable, data) => {

    var response = null;

    switch (currentTable) {
        case 'About':
            response = await AboutService.CreateAbout(data);
            break;
        case 'AccessLevels':
            response = await AccessLevelsService.CreateAccessLevel(data);
            break;
        case 'Contacts':
            response = await ContactsService.CreateContact(data);
            break;
        case 'Languages':
            response = await LanguagesService.CreateLanguage(data);
            break;
        case 'Posts':
            response = await PostsService.CreatePost(data);
            break;
        case 'PostsTranstations':
            response = await PostsTranslationService.CreatePostsTranslation(data);
            break;
        case 'Users':
            response = await UsersService.CreateUser(data);
            break;
        case 'UserProfile':
            response = await UserProfileService.CreateUserProfile(data);
            break;
        case 'UserRoles':
            response = await UserRolesService.CreateUserRole(data);
            break;
        default:
            break;
    };

    return response;
};