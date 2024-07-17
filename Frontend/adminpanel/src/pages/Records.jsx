import React, { useEffect, useState, useContext } from 'react';
import { useRecords } from '../hooks/useRecords';
import { useFetching } from '../hooks/useFetching';
import { getPageCount } from '../utils/getPageCount';
import { getDBTablesList } from '../utils/getDBTablesList';
import { getRecordFields } from '../utils/getRecordFields';
import { getTableTotalCount } from '../utils/getTableTotalCount';
import { getAllRecords } from '../utils/getAllRecords';
import { toLowerCase } from '../utils/toLowerCase';
import RecordList from '../components/RecordList';
import PageCountSwitcher from '../components/PageCountSwitcher';
import RecordForm from '../components/RecordForm';
import RecordFilter from '../components/RecordFilter';
import GeneralButton from '../components/UI/button/GeneralButton';
import GeneralModal from '../components/UI/modal/GeneralModal';
import Loader from '../components/UI/loader/Loader';
import Pagination from '../components/UI/pagination/Pagination';
import TablesList from '../components/TablesList';
import '../styles/App.css';
import { ModalContext } from '../context/ModalContext';

// rsc - create template component

function Records() {
  const { 
    openEditModal, openCreateModal, addRecord,
    mode, oldRecord, modifyRecordError,
    currentTable, setCurrentTable,
    currentRecords, setCurrentRecords,
    totalPages, setTotalPages,
    recordFields, setRecordFields,
    editRecord, removeRecord
  } = useContext(ModalContext);

  const [filter, setFilter] = useState({ sort: '', query: '' });
  const [limit, setLimit] = useState(5);

  const { modal, setModal } = useContext(ModalContext);

  const [page, setPage] = useState(1);
  const [DBTables, setDBTables] = useState([]);

  const sortedAndSearchedRecords = useRecords(currentRecords, filter.sort, filter.query);

  const [fetchRecords, isRecordLoading, postError] = useFetching(async (limit, page) => {

    var responseData = await getAllRecords(currentTable, limit, page);
    var responseFields = await getRecordFields(currentTable);
    var responseTotalCount = await getTableTotalCount(currentTable);

    if (responseData) {
      if (responseData.data) {
        if (responseTotalCount.data) {
          setCurrentTable(currentTable);
          setTotalPages(getPageCount(responseTotalCount.data, limit));
          setCurrentRecords(responseData.data);
          setRecordFields(toLowerCase(responseFields.data));
        }
      }
    }
  });

  const [fetchTables, isTablesLoading, tablesError] = useFetching(() => {
    const response = getDBTablesList();
    setDBTables(response);
  });
  
  const changePage = (page) => {
    setPage(page);
    fetchRecords(limit, page);
  };

  useEffect(() => {
    fetchRecords(limit, page);
    // eslint-disable-next-line
  }, [page, limit, currentTable]);

  useEffect(() => {
    fetchTables();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">

      {tablesError &&
        <h1>Cannot load list of tables!</h1>
      }

      {isTablesLoading
        ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}><Loader /></div>
        : <TablesList title="List of tables" tables={DBTables} setCurrentTable={setCurrentTable} />
      }

      <hr style={{ margin: '15px 0' }} />

      {currentTable &&
        <GeneralButton onClick={openCreateModal}>
          Create {currentTable}
        </GeneralButton>
      }

      <GeneralModal visible={modal} setVisible={setModal} >
        <RecordForm
          mode={mode}
          currentTable={currentTable}
          create={addRecord}
          edit={editRecord}
          fields={recordFields}
          oldRecord={oldRecord}
          requestError={modifyRecordError}
        />
      </GeneralModal>

      <hr style={{ margin: '15px 0' }} />

      <RecordFilter filter={filter} setFilter={setFilter} fields={recordFields} />

      <PageCountSwitcher limit={limit} setLimit={setLimit} />

      <hr style={{ margin: '15px 0' }} />

      {postError &&
        <h3 style={{ textAlign: 'center', color: 'red' }}>{postError}</h3>
      }

      {isRecordLoading
        ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}><Loader /></div>
        : <RecordList
          records={sortedAndSearchedRecords}
          table={currentTable}
          edit={openEditModal}
          remove={removeRecord}
        />
      }

      <Pagination page={page}
        changePage={changePage}
        totalPages={totalPages}
      />

    </div>
  );
};

export default Records;