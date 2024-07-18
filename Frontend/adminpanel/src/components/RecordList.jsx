import React, { useContext } from 'react';
import RecordItem from './RecordItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ModalContext } from '../context/ModalContext';

export default function RecordList({ records }) {
    let { currentTable } = useContext(ModalContext);

    if (currentTable === "") {
        currentTable = "Database Records";
    }

    if (!records && !records.length) {
        return (
            <h1 style={{ textAlign: 'center' }}>
                {currentTable} not found!
            </h1>
        );
    }

    return (
        <div>
            <h1 className='listHeader'>
                {currentTable}
            </h1>
            <TransitionGroup>
                {records.map((record) =>
                    <CSSTransition
                        key={record.id}
                        timeout={500}
                        classNames="post"
                    >
                        <MemoizedRecordItem record={record} />
                    </CSSTransition>

                )}
            </TransitionGroup>

        </div>
    );
};

const MemoizedRecordItem = React.memo(({ record }) => <RecordItem record={record} />);