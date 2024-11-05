import React, { useContext } from 'react';
import { usePagination } from '../../../hooks/usePagination';
import { DataContext } from '../../../provider/context/DataProvider';
import { PaginationContext } from '../../../provider/context/PaginationProvider';
import mcss from './index.module.css'

export default function Pagination() {

    const {
        totalPages,
    } = useContext(DataContext);

    const {
        page, changePage
    } = useContext(PaginationContext);

    let pagesArray = usePagination(totalPages);

    return (
        <div className={mcss.container}>
            {pagesArray.map(pageNumber =>
                <span
                    onClick={() => changePage(pageNumber)}
                    key={pageNumber}
                    className={page === pageNumber ? 'page page__current' : 'page'}
                >
                    {pageNumber}
                </span>
            )}
        </div>
    );
};