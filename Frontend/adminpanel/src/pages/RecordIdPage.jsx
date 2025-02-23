import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetching } from '../hooks/useFetching';
import { getRecordById } from '../utils/getRecordById';
import { byteArrayToBase64 } from '../utils/convertByteArrayToBase64';
import { DataContext } from '../provider/context/DataProvider';
import { ModalContext } from '../provider/context/ModalProvider';
import { ForeignKeysContext } from '../provider/context/ForeignKeysProvider';
import { PaginationContext } from '../provider/context/PaginationProvider';
import Loader from '../components/UI/loader/Loader';
import GeneralButton from '../components/UI/button/GeneralButton';
import GeneralModal from '../components/UI/modal/GeneralModal';
import RecordForm from '../components/RecordForm/RecordForm';
import DisplayImage from '../components/UI/image/DisplayImage';

export default function RecordIdPage() {
    const { modal, setModal, fetchRecords } = useContext(ModalContext);
    const { page, limit } = useContext(PaginationContext);
    const { openEditModal, removeRecord } = useContext(ModalContext);
    const { setCurrentTable, currentTable, currentRecords } = useContext(DataContext)
    const { fetchMultipleFkData, foreignKeys, fkError } = useContext(ForeignKeysContext);

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
        navigate(`/records`);
    }, [removeRecord, record, navigate]);

    useEffect(() => {
        setCurrentTable(params.table)
        fetchRecords(limit, page) // limit = 1, page = 5, 
        fetchRecordById(params.table, params.id);
        // eslint-disable-next-line
    }, [currentTable]);

    useEffect(() => {
        fetchRecordById(params.table, params.id);
        // eslint-disable-next-line
    }, [currentRecords])

    useEffect(() => {
        const fkFields = Object.entries(record)
            .filter(([key]) => key.startsWith("fk"))
            .map(([key, value]) => ({ key, value }));

        if (fkFields.length) {
            fetchMultipleFkData(fkFields);
        }
    }, [record, fetchMultipleFkData]);

    return (
        <div>
            <GeneralModal visible={modal} setVisible={setModal} >
                <RecordForm />
            </GeneralModal>
            <h1>{params.table} page with id {params.id}</h1>
            {error !== null
                ? isLoading
                    ? <Loader />
                    : <div>
                        {Object.entries(record).map(([key, value]) => (
                            <div key={key}>
                                {key}: {key.startsWith("fk") ? (
                                    fkError ? fkError : `${foreignKeys[`${key}_${value}`] || "Loading..."} (${value})`
                                ) : (
                                    key === "imageData" ? (
                                        <DisplayImage base64Img={byteArrayToBase64(value)} fullSize={false} />
                                    ) : value
                                )}
                            </div>
                        ))}
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