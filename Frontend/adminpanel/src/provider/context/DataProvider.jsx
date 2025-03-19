import { createContext, useState } from 'react';
import { getPageCount } from '../../utils/getPageCount.js';
import { getRecordFields } from '../../utils/getRecordFields.js';
import { getTableTotalCount } from '../../utils/getTableTotalCount.js';
import { getAllRecords } from '../../utils/getAllRecords.js';
import { toLowerCase } from '../../utils/toLowerCase.js';
import { useFetching } from '../../hooks/useFetching.jsx';

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [currentTable, setCurrentTable] = useState('');
  const [currentRecords, setCurrentRecords] = useState([]);
  const [recordFields, setRecordFields] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [fetchRecords, isRecordLoading, postError] = useFetching(
    async (limit, page, login, password) => {
      try {
        const responseData = await getAllRecords(
          currentTable,
          limit,
          page,
          login,
          password
        );
        const responseFields = await getRecordFields(
          currentTable,
          login,
          password
        );
        const responseTotalCount = await getTableTotalCount(
          currentTable,
          login,
          password
        );

        if (responseData && responseData.data) {
          setCurrentTable(currentTable);
          setTotalPages(getPageCount(responseTotalCount.data, limit));
          setCurrentRecords(responseData.data);
          setRecordFields(toLowerCase(responseFields.data));
        }
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    }
  );

  return (
    <DataContext.Provider
      value={{
        currentTable,
        setCurrentTable,
        currentRecords,
        setCurrentRecords,
        recordFields,
        setRecordFields,
        totalPages,
        fetchRecords,
        isRecordLoading,
        postError,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
