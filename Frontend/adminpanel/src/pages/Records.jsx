import React, { useEffect, useState, useContext } from 'react';
import { useRecords } from '../hooks/useRecords';
import { useFetching } from '../hooks/useFetching';
import { getDBTablesList } from '../utils/getDBTablesList';
import { ModalContext } from '../provider/context/ModalProvider';
import { PaginationContext } from '../provider/context/PaginationProvider';
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
import { PaginationContext } from '../provider/context/PaginationProvider';

// rsc - create template component

function Records() {
  const {
    openCreateModal, addRecord, editRecord,
    mode, oldRecord, modifyRecordError,
    modal, setModal, currentTable, setCurrentTable,
    currentRecords, recordFields,
    fetchRecords, isRecordLoading, postError
  } = useContext(ModalContext);

  const { page, limit } = useContext(PaginationContext);

  const [filter, setFilter] = useState({ sort: '', query: '' });

  const [DBTables, setDBTables] = useState([]);

  const sortedAndSearchedRecords = useRecords(currentRecords, filter.sort, filter.query);

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

      <PageCountSwitcher />

      <hr style={{ margin: '15px 0' }} />

      {postError &&
        <h3 style={{ textAlign: 'center', color: 'red' }}>{postError}</h3>
      }

      {isRecordLoading
        ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}><Loader /></div>
        : <RecordList records={sortedAndSearchedRecords}
        />
      }

      <Pagination />

    </div>
  );
};

export default Records;