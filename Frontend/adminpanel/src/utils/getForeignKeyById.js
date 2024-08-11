import ForeignKeysService from '../API/ForeignKeysService';

export const getForeignKeyById = async (foreignFieldKey, id) => {

    var response = null;

    switch (foreignFieldKey) {
        case 'FkLanguages':
            response = await ForeignKeysService.GetFkLanguagesData(id);
            break;
        case 'FkUsers':
            response = await ForeignKeysService.GetFkUsersData(id);
            break;
        case 'FkUserRoles':
            response = await ForeignKeysService.GetFkUserRoles(id);
            break;
        case 'FkAccessLevels':
            response = await ForeignKeysService.GetFkAccessLevelsData(id);
            break;
        case 'FkPosts':
            response = await ForeignKeysService.GetFkPostsData(id);
            break;
    };

    return response;
};