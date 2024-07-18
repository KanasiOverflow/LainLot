import { createContext, useState, useCallback } from 'react';
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

  const openEditModal = useCallback((record) => {
    setMode("Edit");
    setModifyRecordError("");
    setModal(true);
    setOldRecord(record);
}, [setMode, setModifyRecordError, setModal, setOldRecord]);

const openCreateModal = useCallback(() => {
    setMode("Create");
    setModifyRecordError("");
    setModal(true);
    setOldRecord(null);
}, [setMode, setModifyRecordError, setModal, setOldRecord]);

const addRecord = useCallback(async (record) => {
    try {
        const response = await createRecord(currentTable, record);
        if (response && response.data) {
            setCurrentRecords([...currentRecords, response.data]);
            setModal(false);
        } else {
            setModifyRecordError(response);
        }
    } catch (error) {
        console.error("Error adding record:", error);
        setModifyRecordError(error.message || "Failed to add record");
    }
}, [currentTable, setCurrentRecords, currentRecords, setModal, setModifyRecordError]);

const editRecord = useCallback(async (record) => {
    try {
        const response = await updateRecord(currentTable, record);
        if (response && response.data) {
            setCurrentRecords(prevRecords =>
                prevRecords.map(p => (p.id === record.id ? response.data : p))
            );
            setModal(false);
        } else {
            setModifyRecordError(response);
        }
    } catch (error) {
        console.error("Error editing record:", error);
        setModifyRecordError(error.message || "Failed to edit record");
    }
}, [currentTable, setCurrentRecords, setModal, setModifyRecordError]);

const removeRecord = useCallback(async (record) => {
    try {
        const response = await removeRecordById(currentTable, record.id);
        if (response) {
            setCurrentRecords(prevRecords =>
                prevRecords.filter(p => p.id !== record.id)
            );
        }
    } catch (error) {
        console.error("Error removing record:", error);
    }
}, [currentTable, setCurrentRecords]);

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