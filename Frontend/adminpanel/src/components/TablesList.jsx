import React from 'react';
import GeneralButton from './UI/button/GeneralButton';

export default function TablesList({ setCurrentTable, tables, title }) {

    if (!tables.length) {
        return (
            <h1 style={{ textAlign: 'center' }}>
                {title} not found!
            </h1>
        );
    }

    return (
        <div>
            <h4 className='listHeader'>
                {title}
            </h4>
            <div className='container'>
                {tables.map((tableName, i) =>
                    <GeneralButton 
                        key={i}
                        onClick={() => setCurrentTable(tableName)}
                    >
                        {tableName}
                    </GeneralButton>
                )}
            </div>
        </div>
    )
};