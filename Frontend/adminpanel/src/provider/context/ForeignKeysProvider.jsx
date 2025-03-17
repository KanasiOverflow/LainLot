import { createContext, useState, useCallback } from 'react';
import { useFetching } from '../../hooks/useFetching.jsx';
import { getForeignKeyById } from '../../utils/getForeignKeyById.js';

export const ForeignKeysContext = createContext(null);

export const ForeignKeysProvider = ({ children }) => {
  const [foreignKeys, setForeignKeys] = useState({});

  const [fetchFkData, fkLoading, fkError] = useFetching(
    async (foreignFieldKey, id, login, password) => {
      const cacheKey = `${foreignFieldKey}_${id}`;
      if (foreignKeys[cacheKey]) return;

      const responseData = await getForeignKeyById(foreignFieldKey, id, login, password);

      if (responseData?.data) {
        setForeignKeys((prev) => ({
          ...prev,
          [cacheKey]: responseData.data,
        }));
      }
    },
  );

  const fetchMultipleFkData = useCallback(
    async (fkFields, login, password) => {
      const fetchPromises = fkFields.map(({ key, value }) =>
        fetchFkData(key, value, login, password),
      );
      await Promise.all(fetchPromises);
    },
    [fetchFkData],
  );

  return (
    <ForeignKeysContext.Provider
      value={{
        fetchFkData,
        fetchMultipleFkData,
        fkLoading,
        fkError,
        foreignKeys,
      }}
    >
      {children}
    </ForeignKeysContext.Provider>
  );
};
