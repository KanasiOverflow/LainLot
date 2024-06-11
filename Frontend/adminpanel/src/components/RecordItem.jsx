import React from 'react';
import GeneralButton from './UI/button/GeneralButton';
import { useNavigate } from 'react-router-dom';

export default function RecordItem({ record, edit, remove }) {

    const navigate = useNavigate();

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
                <GeneralButton onClick={() => navigate(`/records/${record.id}`)}>
                    Open
                </GeneralButton>
                <GeneralButton onClick={() => edit(record)}>
                    Edit
                </GeneralButton>
                <GeneralButton onClick={() => remove(record)}>
                    Delete
                </GeneralButton>
            </div>
        </div>
    );
};