import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetching } from '../hooks/useFetching';
import { getRecordById } from '../utils/getRecordById';
import Loader from '../components/UI/loader/Loader';
import GeneralButton from '../components/UI/button/GeneralButton';
import { ModalContext } from '../provider/context/ModalContext';
import RecordForm from '../components/RecordForm';
import GeneralModal from '../components/UI/modal/GeneralModal';

export default function RecordIdPage() {
    const {
        addRecord, editRecord,
        mode, oldRecord, modifyRecordError,
        modal, setModal, currentTable, recordFields
      } = useContext(ModalContext);

    const { openEditModal, removeRecord} = useContext(ModalContext);

    const params = useParams();
    const navigate = useNavigate();

    const [record, setRecord] = useState({});

    const [fetchRecordById, isLoading, error] = useFetching(async (table, id) => {
        const response = await getRecordById(table, id);
        setRecord(response.data);
    });

    const handleReturnToRecords = useCallback(() => {
        navigate(`/records`);
    }, [navigate]);

    const handleOpenEditModal = useCallback(() => {
        openEditModal(record);
    }, [openEditModal, record]);

    const handleRemoveRecord = useCallback(() => {
        removeRecord(record);
    }, [removeRecord, record]);
    
    useEffect(() => {
        fetchRecordById(params.table, params.id);
        // eslint-disable-next-line
    }, []);
    
    return (
        <div>
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
            <h1>{params.table} page with id {params.id}</h1>
            {error !== null
                ? isLoading
                    ? <Loader />
                    : <div>
                        {Object.keys(record).map(key =>
                            <div key={key}>
                                {key}: {record[key]}
                            </div>
                        )}
                    </div>
                : <h1>{error.message}</h1>}
            <div>
                <GeneralButton onClick={handleReturnToRecords}>Return to {params.table}</GeneralButton>
                <GeneralButton onClick={handleOpenEditModal}>Edit</GeneralButton>
                <GeneralButton onClick={handleRemoveRecord}>Delete</GeneralButton>
            </div>
        </div>
    );
};