import React from 'react';
import RecordItem from './RecordItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export default function RecordList({ records, title, edit, remove }) {

    if (title === "") {
        title = "Database Records";
    }

    if (!records && !records.length) {
        return (
            <h1 style={{ textAlign: 'center' }}>
                {title} not found!
            </h1>
        );
    }

    return (
        <div>
            <h1 className='listHeader'>
                {title}
            </h1>
            <TransitionGroup>
                {records.map((record) =>
                    <CSSTransition
                        key={record.id}
                        timeout={500}
                        classNames="post"
                    >
                        <RecordItem  record={record} edit={edit} remove={remove} />
                    </CSSTransition>

                )}
            </TransitionGroup>

        </div>
    );
};