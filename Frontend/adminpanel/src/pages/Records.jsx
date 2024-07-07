import React, { useEffect, useState } from 'react';
import { useRecords } from '../hooks/useRecords';
import { useFetching } from '../hooks/useFetching';
import { getPageCount } from '../utils/getPageCount';
import { getDBTablesList } from '../utils/getDBTablesList';
import { getRecordFields } from '../utils/getRecordFields';
import { getAllRecords } from '../utils/getAllRecords';
import { removeRecordById } from '../utils/removeRecordById';
import { createRecord } from '../utils/createRecord';
import { updateRecord } from '../utils/updateRecord';
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

// rsc - create template component

function Records() {
  const [filter, setFilter] = useState({ sort: '', query: '' });
  const [limit, setLimit] = useState(10);
  const [modal, setModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [DBTables, setDBTables] = useState([]);
  const [recordFields, setRecordFields] = useState([]);
  const [mode, setMode] = useState("");
  const [oldRecord, setOldRecord] = useState({});
  const [modifyRecordError, setModifyRecordError] = useState("");

  // Tables
  const [currentTable, setCurrentTable] = useState("");
  const [currentRecords, setCurrentRecords] = useState([]);

  const sortedAndSearchedRecords = useRecords(currentRecords, filter.sort, filter.query);

  const [fetchRecords, isRecordLoading, postError] = useFetching(async (limit, page) => {

    var responseData = await getAllRecords(currentTable, limit, page);
    var responseFields = await getRecordFields(currentTable);

    if (responseData) {
      if (responseData.data) {
        setCurrentTable(currentTable);

        const totalCount = responseData.data.length;
        setTotalPages(getPageCount(totalCount, limit));

        setCurrentRecords(responseData.data);
        setRecordFields(toLowerCase(responseFields.data));
      }
    }
  });

  const [fetchTables, isTablesLoading, tablesError] = useFetching(() => {
    const response = getDBTablesList();
    setDBTables(response);
  });

  const openCreateModal = () => {
    setMode("Create");
    setModifyRecordError("");
    setModal(true);
    setOldRecord(null);
  };

  const openEditModal = (record) => {
    setMode("Edit");
    setModifyRecordError("");
    setModal(true);
    setOldRecord(record);
  };

  const addRecord = async (record) => {
    var response = await createRecord(currentTable, record);
    if (response !== null && response !== undefined) {
      if (response.data) {
        setCurrentRecords([...currentRecords, response.data]);
        setModal(false);
      }
      else {
        setModifyRecordError(response);
      }
    }
  };

  const editRecord = async (record) => {
    var response = await updateRecord(currentTable, record);
    if (response !== null && response !== undefined) {
      if (response.data) {
        setCurrentRecords(currentRecords.filter(p => p.id !== record.id));
        setCurrentRecords([...currentRecords, response.data]);
        setModal(false);
      }
      else {
        setModifyRecordError(response);
      }
    }
  };

  const removePost = async (record) => {
    var response = await removeRecordById(currentTable, record.id);

    if (response !== null && response !== undefined) {
      setCurrentRecords(currentRecords.filter(p => p.id !== record.id));
    }
  };

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
          remove={removePost}
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