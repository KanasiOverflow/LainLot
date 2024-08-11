import ForeignKeysService from '../API/ForeignKeysService';

export const getForeignKeyById = async (foreignFieldKey, id) => {

    var response = null;

    switch (foreignFieldKey) {
        case 'fkLanguages':
            response = await ForeignKeysService.GetFkLanguagesData(id);
            break;
        case 'fkUsers':
            response = await ForeignKeysService.GetFkUsersData(id);
            break;
        case 'fkUserRoles':
            response = await ForeignKeysService.GetFkUserRoles(id);
            break;
        case 'fkAccessLevels':
            response = await ForeignKeysService.GetFkAccessLevelsData(id);
            break;
        case 'fkPosts':
            response = await ForeignKeysService.GetFkPostsData(id);
            break;
        default:
            break;
    };

    return response;
};