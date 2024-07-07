import AboutService from '../API/AboutService';
import AccessLevelsService from '../API/AccessLevelsService';
import ContactsService from '../API/ContactsService';
import LanguagesService from '../API/LanguagesService';
import PostsService from '../API/PostsService';
import PostsTranslationService from '../API/PostsTranslationsService';
import UsersService from '../API/UsersService';
import UserProfileService from '../API/UserProfileService';
import UserRolesService from '../API/UserRolesService';

export const getRecordById = async (currentTable, id) => {

    var response = null;
    
    switch (currentTable) {
        case 'About':
            response = await AboutService.GetAboutById(id);
            break;
        case 'AccessLevels':
            response = await AccessLevelsService.GetAccessLevelById(id);
            break;
        case 'Contacts':
            response = await ContactsService.GetContactById(id);
            break;
        case 'Languages':
            response = await LanguagesService.GetLanguagesById(id);
            break;
        case 'Posts':
            response = await PostsService.GetPostById(id);
            break;
        case 'PostsTranstations':
            response = await PostsTranslationService.GetPostsTranslationById(id);
            break;
        case 'Users':
            response = await UsersService.GetUserById(id);
            break;
        case 'UserProfile':
            response = await UserProfileService.GetUserProfilesById(id);
            break;
        case 'UserRoles':
            response = await UserRolesService.getRecordById(id);
            break;
        default:
            break;
    };

    return response;
};