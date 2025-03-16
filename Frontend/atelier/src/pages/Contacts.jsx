import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ContactsPageService from 'api/Atelier/ContactsPageService';
import { useFetching } from '../hooks/useFetching';

export default function Contacts() {
    const { i18n } = useTranslation();
    const [aboutContacts, setAboutContacts] = useState([]);

    const [fetchContacts, isLoading, error] = useFetching(async () => {
        const response = await ContactsPageService.GetContacts(i18n.language);
        if (response && Array.isArray(response.data)) {
            setAboutContacts(response.data);
        }
    });

    useEffect(() => {
        fetchContacts();
        // eslint-disable-next-line
    }, [i18n.language]);

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {aboutContacts.map((item) => (
                        <li key={item.id}>
                            <h3>{item.address}</h3>
                            <h3>{item.phone}</h3>
                            <h3>{item.email}</h3>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
};