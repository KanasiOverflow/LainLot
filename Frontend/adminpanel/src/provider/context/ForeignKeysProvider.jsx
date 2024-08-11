import { createContext, useState } from 'react';
import { useFetching } from '../../hooks/useFetching';
import { getForeignKeyById } from '../../utils/getForeignKeyById';

export const ForeignKeysContext = createContext(null);

export const ForeignKeysProvider = ({ children }) => {

    const [foreignKeyValue, setForeignKeyValue] = useState("");

    const [fetchFkData, fkLoading, fkError] = useFetching(async (foreignFieldKey, id) => {

        const responseData = await getForeignKeyById(foreignFieldKey, id);

        if(responseData && responseData.data){
            setForeignKeyValue(responseData.data);
            console.log("responseData: " + responseData.data);
            console.log("foreignKeyValue: " + foreignKeyValue);
        }
    });

    return (
        <ForeignKeysContext.Provider value={{
            fetchFkData,
            fkLoading,
            fkError,
            foreignKeyValue
        }}>
            {children}
        </ForeignKeysContext.Provider>
    )
};