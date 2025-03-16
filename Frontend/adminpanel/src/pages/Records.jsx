import React, { useEffect, useState, useContext } from 'react';
import { useRecords } from '../hooks/useRecords';
import { useFetching } from '../hooks/useFetching.jsx';
import { getDBTablesList } from '../utils/getDBTablesList.js';
import { ModalContext } from '../provider/context/ModalProvider.jsx';
import { PaginationContext } from '../provider/context/PaginationProvider.jsx';
import RecordList from '../components/RecordList/RecordList.jsx';
import PageCountSwitcher from '../components/PageCountSwitcher/PageCountSwitcher.jsx';
import RecordForm from '../components/RecordForm/RecordForm.jsx';
import RecordFilter from '../components/RecordFilter/RecordFilter.jsx';
import GeneralButton from '../components/UI/button/GeneralButton.jsx';
import GeneralModal from '../components/UI/modal/GeneralModal.jsx';
import Loader from '../components/UI/loader/Loader.jsx';
import Pagination from '../components/UI/pagination/Pagination.jsx';
import TablesSidebar from '../components/TablesSidebar/TablesSidebar.jsx';

// rsc - create template component

function Records() {
  const {
    openCreateModal,
    currentTable,
    setCurrentTable,
    currentRecords,
    recordFields,
    fetchRecords,
    isRecordLoading,
    postError,
  } = useContext(ModalContext);

  const { page, limit } = useContext(PaginationContext);

  const [filter, setFilter] = useState({ sort: '', query: '' });

  const [DBTables, setDBTables] = useState([]);

  const sortedAndSearchedRecords = useRecords(
    currentRecords,
    filter.sort,
    filter.query,
  );

  const [fetchTables, isTablesLoading, tablesError] = useFetching(() => {
    const response = getDBTablesList();
    setDBTables(response);
  });

  useEffect(() => {
    fetchRecords(limit, page);
    // eslint-disable-next-line
  }, [page, limit, currentTable]);

  useEffect(() => {
    fetchTables();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="records page">
      {tablesError && <h1>Cannot load list of tables!</h1>}

      {isTablesLoading ? (
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}
        >
          <Loader />
        </div>
      ) : (
        <TablesSidebar tables={DBTables} setCurrentTable={setCurrentTable} />
      )}

      <hr style={{ margin: '15px 0' }} />

      {isRecordLoading === false && currentTable && (
        <GeneralButton onClick={openCreateModal}>
          Create {currentTable} record
        </GeneralButton>
      )}

      <GeneralModal>
        <RecordForm />
      </GeneralModal>

      <hr style={{ margin: '15px 0' }} />

      <RecordFilter
        filter={filter}
        setFilter={setFilter}
        fields={recordFields}
      />

      <PageCountSwitcher />

      <hr style={{ margin: '15px 0' }} />

      {postError && (
        <h3 style={{ textAlign: 'center', color: 'red' }}>{postError}</h3>
      )}

      {isRecordLoading ? (
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}
        >
          <Loader />
        </div>
      ) : (
        <RecordList records={sortedAndSearchedRecords} />
      )}

      <Pagination />
    </div>
  );
}

export default Records;
