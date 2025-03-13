import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetching } from '../../hooks/useFetching';
import AboutService from 'api/CRUD/AboutService';

export const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const [langId, setLangId] = useState(null);

    const [fetchLangId, isLangLoading, langError] = useFetching(async (lang) => {
        const response = await AboutService.GetLanguageIdByAbbreviation(lang);
        if (response && response.data) {
            setLangId(response.data);
            localStorage.setItem('langId', response.data);
        }
    });

    useEffect(() => {
        fetchLangId(i18n.language);
    }, [i18n.language]);

    return (
        <LanguageContext.Provider value={{
            langId,
            isLangLoading,
            langError
        }}>
            {children}
        </LanguageContext.Provider>
    );
};