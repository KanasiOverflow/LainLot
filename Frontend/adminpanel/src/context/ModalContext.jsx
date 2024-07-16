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

    const [totalPages, setTotalPages] = useState(0);
    const [recordFields, setRecordFields] = useState([]);
/*---------------------------------------TABLES---------------------------------------*/

    const [currentTable, setCurrentTable] = useState("");
    const [currentRecords, setCurrentRecords] = useState([]);

/*---------------------------------SWITCH-MODAL-MENU------------------------------------*/
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
/*------------------------------------FUNCTIONALITY---------------------------------------*/
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
/*------------------------------------------------------------------------------------------*/
    return (
      <ModalContext.Provider value={{
          openEditModal, openCreateModal, addRecord,
          mode, setMode, oldRecord, setOldRecord, modifyRecordError,
          setModifyRecordError, modal, setModal,
          currentTable, setCurrentTable,
          currentRecords, setCurrentRecords,
          totalPages, setTotalPages,
          recordFields, setRecordFields,
          editRecord, removeRecord
      }}>
        {children}
      </ModalContext.Provider>
    );
  };