import React, { createContext, useCallback, useContext, useState } from 'react'
import { DataContext } from '../context/DataProvider';

export const PaginationContext = createContext(null);

export const PaginationProvider = ({ children }) => {

    const {
        fetchRecords
    } = useContext(DataContext);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const changePage = useCallback((page) => {
        setPage(page);
        fetchRecords(limit, page);
    }, [fetchRecords, limit]);

    return (
        <PaginationContext.Provider value={{
            page, changePage,
            limit, setLimit
        }}>
            {children}
        </PaginationContext.Provider>
    )
};