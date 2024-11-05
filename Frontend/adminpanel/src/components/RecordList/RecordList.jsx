import React, { useContext, forwardRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ModalContext } from '../../provider/context/ModalProvider';
import RecordItem from '../RecordItem/RecordItem';

const MemoizedRecordItem = React.memo(
    forwardRef((props, ref) => <RecordItem ref={ref} {...props} />)
);

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