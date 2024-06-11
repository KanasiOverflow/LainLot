import AboutService from '../API/AboutService';
import AccessLevelsService from '../API/AccessLevelsService';
import ContactsService from '../API/ContactsService';
import LanguagesService from '../API/LanguagesService';
import PostsService from '../API/PostsService';
import PostsTranslationService from '../API/PostsTranslationsService';
import UsersService from '../API/UsersService';
import UserProfileService from '../API/UserProfileService';
import UserRolesService from '../API/UserRolesService';

export const removeRecordById = async (currentTable, id) => {

    var response = null;

    switch (currentTable) {
        case 'About':
            response = await AboutService.DeleteAbout(id);
            break;
        case 'AccessLevels':
            response = await AccessLevelsService.DeleteAccessLevel(id);
            break;
        case 'Contacts':
            response = await ContactsService.DeleteContact(id);
            break;
        case 'Languages':
            response = await LanguagesService.DeleteLanguage(id);
            break;
        case 'Posts':
            response = await PostsService.DeletePost(id);
            break;
        case 'PostsTranstations':
            response = await PostsTranslationService.DeletePostsTranslation(id);
            break;
        case 'Users':
            response = await UsersService.DeleteUser(id);
            break;
        case 'UserProfile':
            response = await UserProfileService.DeleteUserProfile(id);
            break;
        case 'UserRoles':
            response = await UserRolesService.DeleteUserRole(id);
            break;
        default:
            break;
    };

    return response;
};