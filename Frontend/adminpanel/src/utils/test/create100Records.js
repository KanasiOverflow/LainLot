import AboutService from '../../API/AboutService';
import AccessLevelsService from '../../API/AccessLevelsService';
import ContactsService from '../../API/ContactsService';
import LanguagesService from '../../API/LanguagesService';
import PostsService from '../../API/PostsService';
import PostsTranslationService from '../../API/PostsTranslationsService';
import UsersService from '../../API/UsersService';
import UserProfileService from '../../API/UserProfileService';
import UserRolesService from '../../API/UserRolesService';

export const create100Records = async (currentTable) => {

    var response = null;
    var data = null;

    for (var i = 0; i < 100; i++) {
        switch (currentTable) {
            case 'About':

                data = {
                    Id: i,
                    FkLanguages: 1,
                    Header: "Header " + i,
                    Text: "Text " + i
                };

                response = await AboutService.CreateAbout(data);
                break;
            case 'AccessLevels':

                data = {
                    Id: i,
                    Level: i,
                    Description: "Description " + i
                };

                response = await AccessLevelsService.CreateAccessLevel(data);
                break;
            case 'Contacts':

                data = {
                    Id: i,
                    FkLanguages: 1,
                    Address: "Address " + i,
                    Phone: "Phone " + i,
                    Email: "Email " + i
                };

                response = await ContactsService.CreateContact(data);
                break;
            case 'Languages':

                data = {
                    Id: i,
                    FullName: "FullName " + i,
                    Abbreviation: "UNKW",
                    Description: "Description " + i,
                    DateFormat: "DateFormat " + i,
                    TimeFormat: "TimeFormat " + i
                };

                response = await LanguagesService.CreateLanguage(data);
                break;
            case 'Posts':

                data = {
                    Id: i,
                    PostDate: "PostDate " + i,
                    PostTime: "PostTime " + i,
                    Name: "Name " + i,
                    Description: "Description " + i,
                    Text: "Text " + i,
                    Tags: "Tags " + i,
                    Photo: "Photo " + i,
                    VisitCount: i
                };

                response = await PostsService.CreatePost(data);
                break;
            case 'PostsTranstations':

                data = {
                    Id: i,
                    FkLanguages: 1,
                    FkPosts: 1,
                    Name: "Name " + i,
                    Description: "Description " + i,
                    Text: "Text " + i
                };

                response = await PostsTranslationService.CreatePostsTranslation(data);
                break;
            case 'Users':

                data = {
                    Id: i,
                    FkUserRoles: 2,
                    Login: "Login " + i,
                    Email: "Email " + i,
                    Password: "Password " + i,
                    DateLink: "DateLink " + i,
                    TimeLink: "TimeLink " + i,
                    ConfirmEmail: "ConfirmEmail " + i,
                    Hash: "Hash " + i
                };

                response = await UsersService.CreateUser(data);
                break;
            case 'UserProfile':

                data = {
                    Id: i,
                    FkUsers: 1,
                    CreateDate: "CreateDate " + i,
                    CreateTime: "CreateTime " + i,
                    FirstName: "FirstName " + i,
                    LastName: "LastName " + i,
                    MiddleName: "MiddleName " + i,
                    Address: "Address " + i,
                    City: "City " + i,
                    ZipPostCode: i,
                    StateProvince: "StateProvince " + i,
                    Country: "Country " + i,
                    Phone: "Phone " + i,
                    Avatar: "Avatar " + i
                };

                response = await UserProfileService.CreateUserProfile(data);
                break;
            case 'UserRoles':

                data = {
                    Id: i,
                    FkAccessLevels: 1,
                    Name: "Name " + i
                };

                response = await UserRolesService.CreateUserRole(data);
                break;
            default:
                break;
        };
    }

    return response;
};