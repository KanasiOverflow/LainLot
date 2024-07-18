import { useContext, useCallback }from 'react';
import GeneralButton from './UI/button/GeneralButton';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../context/ModalContext';

export default function RecordItem({ record }) {
    const { openEditModal, removeRecord, currentTable } = useContext(ModalContext);
    const navigate = useNavigate();
    
    const handleNavigateToProductPage = useCallback(() => {
        navigate(`/records/${currentTable}/${record.id}`);
    }, [navigate, currentTable, record.id]);
    
    const handleOpenEditModal = useCallback(() => {
        openEditModal(record);
    }, [openEditModal, record]);
    
    const handleRemoveRecord = useCallback(() => {
        removeRecord(record);
    }, [removeRecord, record]);

    return (
        <div className='post'>
            <div className='post__content'>
                {Object.keys(record).map(key =>
                    <div key={key}>
                        {key}: {record[key]}
                    </div>
                )}
            </div>
            <div className='post__btns'>
                <GeneralButton onClick={handleNavigateToProductPage}>
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