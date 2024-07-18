import { createContext, useState } from 'react';
import { removeRecordById } from '../utils/removeRecordById';
import { createRecord } from '../utils/createRecord';
import { updateRecord } from '../utils/updateRecord';

export const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {

  const [mode, setMode] = useState("");
  const [oldRecord, setOldRecord] = useState({});
  const [modifyRecordError, setModifyRecordError] = useState("");
  const [modal, setModal] = useState(false);
  const [recordFields, setRecordFields] = useState([]);
  const [currentTable, setCurrentTable] = useState("");
  const [currentRecords, setCurrentRecords] = useState([]);

  const openEditModal = (record) => {
    setMode("Edit");
    setModifyRecordError("");
    setModal(true);
    setOldRecord(record);
  };

  const openCreateModal = () => {
    setMode("Create");
    setModifyRecordError("");
    setModal(true);
    setOldRecord(null);
  };

  const addRecord = async (record) => {
    const response = await createRecord(currentTable, record);
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
    const response = await updateRecord(currentTable, record);
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

  const removeRecord = async (record) => {
    const response = await removeRecordById(currentTable, record.id);

    if (response !== null && response !== undefined) {
      setCurrentRecords(currentRecords.filter(p => p.id !== record.id));
    }
  };

  return (
    <ModalContext.Provider value={{
      openCreateModal, openEditModal,
      addRecord, editRecord, removeRecord,
      mode, oldRecord, modifyRecordError,
      modal, setModal,
      currentTable, setCurrentTable,
      currentRecords, setCurrentRecords,
      recordFields, setRecordFields
    }}>
      {children}
    </ModalContext.Provider>
  );

};