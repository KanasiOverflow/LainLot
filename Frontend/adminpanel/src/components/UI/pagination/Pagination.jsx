import React from 'react';
import { usePagination } from '../../../hooks/usePagination';

export default function Pagination({totalPages, page, changePage}) {

    let pagesArray = usePagination(totalPages);

    return (
        <div className='page__wrapper'>
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