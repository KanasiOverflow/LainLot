import React from 'react';
import GeneralButton from '../UI/button/GeneralButton';
import mcss from './TablesList.module.css'

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
            <h4 className={mcss.listHeader}>
                {title}
            </h4>
            <div className={mcss.container}>
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