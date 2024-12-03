import React, { useContext, forwardRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ModalContext } from '../../provider/context/ModalProvider';
import { itemVariants } from '../../utils/animationVariants';
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
            <AnimatePresence>
                {records.map((record) =>
                    <motion.div
                        key={record.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                    >
                        <MemoizedRecordItem record={record} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};