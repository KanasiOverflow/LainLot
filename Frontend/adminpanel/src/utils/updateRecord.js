import AboutService from '../API/AboutService';
import AccessLevelsService from '../API/AccessLevelsService';
import ContactsService from '../API/ContactsService';
import LanguagesService from '../API/LanguagesService';
import PostsService from '../API/PostsService';
import PostsTranslationService from '../API/PostsTranslationsService';
import UsersService from '../API/UsersService';
import UserProfileService from '../API/UserProfileService';
import UserRolesService from '../API/UserRolesService';

export const updateRecord = async (currentTable, data) => {

    var response = null;

    switch (currentTable) {
        case 'About':
            response = await AboutService.UpdateAbout(data);
            break;
        case 'AccessLevels':
            response = await AccessLevelsService.UpdateAccessLevel(data);
            break;
        case 'Contacts':
            response = await ContactsService.UpdateContact(data);
            break;
        case 'Languages':
            response = await LanguagesService.UpdateLanguage(data);
            break;
        case 'Posts':
            response = await PostsService.UpdatePost(data);
            break;
        case 'PostsTranstations':
            response = await PostsTranslationService.UpdatePostsTranslation(data);
            break;
        case 'Users':
            response = await UsersService.UpdateUser(data);
            break;
        case 'UserProfile':
            response = await UserProfileService.UpdateUserProfile(data);
            break;
        case 'UserRoles':
            response = await UserRolesService.UpdateUserRole(data);
            break;
        default:
            break;
    };

    return response;
};