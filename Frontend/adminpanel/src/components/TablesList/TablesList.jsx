import React from 'react';
import GeneralButton from '../UI/button/GeneralButton';
import cl from './index.module.css'

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
            <h4 className={cl.listHeader}>
                {title}
            </h4>
            <div className={cl.container}>
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