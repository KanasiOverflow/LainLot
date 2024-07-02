import React from 'react';
import RecordItem from './RecordItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export default function RecordList({ records, table, edit, remove }) {

    if (table === "") {
        table = "Database Records";
    }

    if (!records && !records.length) {
        return (
            <h1 style={{ textAlign: 'center' }}>
                {table} not found!
            </h1>
        );
    }

    return (
        <div>
            <h1 className='listHeader'>
                {table}
            </h1>
            <TransitionGroup>
                {records.map((record) =>
                    <CSSTransition
                        key={record.id}
                        timeout={500}
                        classNames="post"
                    >
                        <RecordItem table={table} record={record} edit={edit} remove={remove} />
                    </CSSTransition>

                )}
            </TransitionGroup>

        </div>
    );
};