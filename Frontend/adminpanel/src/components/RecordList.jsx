import React, { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ModalContext } from '../provider/context/ModalProvider';
import RecordItem from './RecordItem';

export default function RecordList({ records }) {
    
    const MemoizedRecordItem = React.memo(({ record }) => <RecordItem record={record} />);

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