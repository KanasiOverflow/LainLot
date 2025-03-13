import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AboutService from 'api/CRUD/AboutService';

export const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {

    const { i18n } = useTranslation();
    const [langId, setLangId] = useState(null);

    const fetchLangId = async (lang) => {
        try {
            const response = await AboutService.GetLanguageIdByAbbreviation(lang);
            if (response && response.data) {
                setLangId(response.data);
                localStorage.setItem('langId', response.data);
            }
        } catch (error) {
            console.error('Ошибка при получении langId:', error);
        }
    };

    useEffect(() => {
        fetchLangId(i18n.language);
    }, [i18n.language]);

    return (
        <LanguageContext.Provider value={{ langId }}>
            {children}
        </LanguageContext.Provider>
    );
};