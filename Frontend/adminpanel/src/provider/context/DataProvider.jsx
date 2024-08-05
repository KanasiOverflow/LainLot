import { createContext, useState } from 'react';
import { getPageCount } from '../../utils/getPageCount';
import { getRecordFields } from '../../utils/getRecordFields';
import { getTableTotalCount } from '../../utils/getTableTotalCount';
import { getAllRecords } from '../../utils/getAllRecords';
import { toLowerCase } from '../../utils/toLowerCase';
import { useFetching } from '../../hooks/useFetching';

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {

    const [currentTable, setCurrentTable] = useState("");
    const [currentRecords, setCurrentRecords] = useState([]);
    const [recordFields, setRecordFields] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    const [fetchRecords, isRecordLoading, postError] = useFetching(async (limit, page) => {

        const responseData = await getAllRecords(currentTable, limit, page);
        const responseFields = await getRecordFields(currentTable);
        const responseTotalCount = await getTableTotalCount(currentTable);

        if (responseData && responseData.data) {
            setCurrentTable(currentTable);
            setTotalPages(getPageCount(responseTotalCount.data, limit));
            setCurrentRecords(responseData.data);
            setRecordFields(toLowerCase(responseFields.data));
        }
    });

    return (
        <DataContext.Provider value={{
            currentTable, setCurrentTable,
            currentRecords, setCurrentRecords,
            recordFields, setRecordFields,
            totalPages,
            fetchRecords, isRecordLoading, postError
        }}>
            {children}
        </DataContext.Provider>
    );
};