import AboutService from 'api/CRUD/AboutService';
import i18n from 'i18next';

export default getLanguageIdByAbbreviation = async () => {
    const lang = i18n.language;
    const response = await AboutService.GetLanguageIdByAbbreviation(lang);
    return response.data;
};
