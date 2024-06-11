import { useMemo } from 'react';

export const useSortedRecords = (records, sort) => {

    const sortedRecords = useMemo(() => {
        if (sort) {
            if (sort === "id" || sort.indexOf("fk") === 0) {
                return [...records].sort((a, b) => Number.parseInt(a[sort]) - Number.parseInt(b[sort]));
            }
            return [...records].sort((a, b) => a[sort].localeCompare(b[sort]));
        }
        return records;
    }, [sort, records]);

    return sortedRecords;
};

export const useRecords = (records, sort, query) => {

    const sortedRecords = useSortedRecords(records, sort);

    const sortedAndSearchedRecords = useMemo(() => {
        if (query === "") {
            return sortedRecords;
        }

        if (sort === "id" || sort.indexOf("fk") === 0) {
            return sortedRecords.filter(element => element[sort] === query);
        }
        else {
            return sortedRecords.filter(element => element[sort].toLocaleLowerCase() === query.toLocaleLowerCase());
        }
    }, [query, sortedRecords, sort]);

    return sortedAndSearchedRecords;
};