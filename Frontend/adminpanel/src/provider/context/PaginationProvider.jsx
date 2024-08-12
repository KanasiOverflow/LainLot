import React, { createContext, useState } from 'react';

// Create a context for pagination
export const PaginationContext = createContext();

// Create a provider component
export const PaginationProvider = ({ children }) => {
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  return (
    <PaginationContext.Provider value={{ limit, setLimit, page, setPage }}>
      {children}
    </PaginationContext.Provider>
  );
};