import { useContext, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../provider/context/ModalProvider';
import { ForeignKeysContext } from '../provider/context/ForeignKeysProvider';
import { findValueByPrefix } from '../utils/findValueByPrefix';
import GeneralButton from './UI/button/GeneralButton';

export default function RecordItem({ record }) {

    const { openEditModal, removeRecord, currentTable } = useContext(ModalContext);
    const { fetchFkData, fkError, foreignKeyValue } = useContext(ForeignKeysContext);

    const navigate = useNavigate();

    const handleOpenRecordIdPage = useCallback(() => {
        navigate(`/records/${currentTable}/${record.id}`);
    }, [navigate, currentTable, record.id]);

    const handleOpenEditModal = useCallback(() => {
        openEditModal(record);
    }, [openEditModal, record]);

    const handleRemoveRecord = useCallback(() => {
        removeRecord(record);
    }, [removeRecord, record]);

    useEffect(() => {
        var fkData = findValueByPrefix(record, "fk");

        if (fkData) {
            fetchFkData(fkData.key, fkData.value);
        }

        // eslint-disable-next-line
    }, []);

    return (
        <div className='post'>
            <div className='post__content'>
                {Object.keys(record).map(key =>
                    <div key={key}>
                        {key}: {key.startsWith("fk") ? (fkError ? fkError : foreignKeyValue + "(" + record[key] + ")") : record[key]}
                    </div>
                )}
            </div>
            <div className='post__btns'>
                <GeneralButton onClick={handleOpenRecordIdPage}>
                    Open
                </GeneralButton>
                <GeneralButton onClick={handleOpenEditModal}>
                    Edit
                </GeneralButton>
                <GeneralButton onClick={handleRemoveRecord}>
                    Delete
                </GeneralButton>
            </div>
        </div>
    );
};