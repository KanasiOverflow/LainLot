import { useMemo } from 'react';

export const useSortedRecords = (records, sort) => {
    const sortedRecords = useMemo(() => {
        if (!sort) return records;

        return [...records].sort((a, b) => {
            const aValue = a[sort] ?? "";
            const bValue = b[sort] ?? "";

            if (sort === "id" || sort.startsWith("fk")) {
                return (parseInt(aValue) || 0) - (parseInt(bValue) || 0);
            }
            return String(aValue).localeCompare(String(bValue));
        });
    }, [sort, records]);

    return sortedRecords;
};

export const useRecords = (records, sort, query) => {
    const sortedRecords = useSortedRecords(records, sort);

    const sortedAndSearchedRecords = useMemo(() => {
        if (!query) return sortedRecords;

        return sortedRecords.filter(element => {
            const value = element[sort];
            if (sort === "id" || sort.startsWith("fk")) {
                return String(value) === String(query);
            }
            return String(value).toLowerCase() === query.toLowerCase();
        });
    }, [query, sortedRecords, sort]);

    return sortedAndSearchedRecords;
};